import asyncio
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Set
import os
import sqlite3
import json
from contextlib import asynccontextmanager
import httpx
import io
import base64
import re
import cv2
import numpy as np
import shutil
import time
import onnxruntime as ort
import datetime
from PIL import Image


DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "caricatures.db")

active_tasks: Set[asyncio.Task] = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: reset any stuck "Generating" statuses to "Awaiting Stylization"
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE employees
            SET status = 'Awaiting Stylization', progress = 0
            WHERE status = 'Generating'
        """)
        conn.commit()
        conn.close()
        print("Startup: Reset any stuck 'Generating' statuses.")
    except Exception as e:
        print(f"Startup error resetting statuses: {e}")
        
    yield
    
    # Shutdown: cancel all active tasks
    print(f"Shutdown: Cancelling {len(active_tasks)} active background tasks...")
    for task in list(active_tasks):
        if not task.done():
            task.cancel()
    if active_tasks:
        await asyncio.gather(*active_tasks, return_exceptions=True)
    print("Shutdown: All background tasks cancelled.")

app = FastAPI(title="Corporate Celebration Dashboard API", lifespan=lifespan)

# Configure CORS so our React frontend can query the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ==========================================
# SQLite Database Initialization
# ==========================================

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            name TEXT,
            gender TEXT,
            designation TEXT,
            department TEXT,
            photo_url TEXT,
            age INTEGER,
            joining_date TEXT,
            anniversary_milestone TEXT,
            hobbies TEXT,
            activities TEXT,
            caricature_url TEXT,
            caricature_name TEXT,
            caricature_model TEXT,
            status TEXT,
            progress INTEGER,
            tags TEXT,
            timeline TEXT,
            email TEXT,
            password_hash TEXT,
            role TEXT,
            job_title TEXT,
            anniversary_date TEXT
        )
    """)
    conn.commit()

    # Safe ALTER migration checks
    alter_cols = [
        ("caricature_name", "TEXT"),
        ("gender", "TEXT"),
        ("caricature_model", "TEXT"),
        ("email", "TEXT"),
        ("password_hash", "TEXT"),
        ("role", "TEXT DEFAULT 'Employee'"),
        ("job_title", "TEXT"),
        ("anniversary_date", "TEXT")
    ]
    for col_name, col_type in alter_cols:
        try:
            cursor.execute(f"SELECT {col_name} FROM employees LIMIT 1")
        except sqlite3.OperationalError:
            cursor.execute(f"ALTER TABLE employees ADD COLUMN {col_name} {col_type}")
            conn.commit()

    # Create wishes table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS wishes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id TEXT,
            receiver_id TEXT,
            message_text TEXT,
            caricature_image_url TEXT,
            is_public INTEGER,
            created_at TEXT
        )
    """)
    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM employees")
    if cursor.fetchone()[0] == 0:
        mock_employees = [
            {
                "id": "1",
                "name": "Sarah Chen",
                "gender": "Female",
                "designation": "Senior Engineer",
                "department": "Product",
                "photo_url": "/sarah_chen_original.png",
                "age": 29,
                "joining_date": "2021-06-15",
                "anniversary_milestone": "5th Anniversary",
                "hobbies": json.dumps(["Coffee Brewing", "Travel Photography", "Digital Art"]),
                "activities": json.dumps(["Hiking", "Tech Blogging", "Running"]),
                "caricature_url": "/static/caricature_1_1782451669.png",
                "caricature_name": "caricature_1_1782451669.png",
                "status": "Ready for Review",
                "progress": 100,
                "tags": json.dumps(["Coffee Lover", "Traveler", "Modern Vector", "Code Artist"]),
                "timeline": json.dumps([
                    {"time": "10:45 AM", "event": "Generation Complete", "status": "completed"},
                    {"time": "Yesterday, 4:20 PM", "event": "Style Refinement Applied", "status": "completed"},
                    {"time": "Yesterday, 2:15 PM", "event": "Initial Persona Created", "status": "completed"}
                ]),
                "email": "sarah@company.com",
                "password_hash": "pbkdf2:sha256:password123",
                "role": "Employee",
                "job_title": "Senior Engineer",
                "anniversary_date": "06-26"
            },
            {
                "id": "2",
                "name": "Marcus Thorne",
                "gender": "Male",
                "designation": "Lead Designer",
                "department": "Marketing",
                "photo_url": "/marcus_thorne_original.png",
                "age": 34,
                "joining_date": "2016-08-01",
                "anniversary_milestone": "10th Anniversary",
                "hobbies": json.dumps(["Wine Tasting", "Public Speaking", "Golfing"]),
                "activities": json.dumps(["Jogging", "Mentoring", "Cooking"]),
                "caricature_url": None,
                "caricature_name": None,
                "status": "Awaiting Stylization",
                "progress": 0,
                "tags": json.dumps(["Public Speaker", "Golfer", "Negotiator", "Wine Connoisseur"]),
                "timeline": json.dumps([
                    {"time": "Just Now", "event": "Milestone Registered", "status": "completed"},
                    {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"}
                ]),
                "email": "marcus@company.com",
                "password_hash": "pbkdf2:sha256:password123",
                "role": "Employee",
                "job_title": "Lead Designer",
                "anniversary_date": "07-01"
            }
        ]
        for emp in mock_employees:
            cursor.execute("""
                INSERT INTO employees (
                    id, name, gender, designation, department, photo_url, age, joining_date, 
                    anniversary_milestone, hobbies, activities, caricature_url, caricature_name, status, progress, tags, timeline,
                    email, password_hash, role, job_title, anniversary_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                emp["id"], emp["name"], emp["gender"], emp["designation"], emp["department"], emp["photo_url"],
                emp["age"], emp["joining_date"], emp["anniversary_milestone"], emp["hobbies"],
                emp["activities"], emp["caricature_url"], emp["caricature_name"], emp["status"], emp["progress"], emp["tags"], emp["timeline"],
                emp["email"], emp["password_hash"], emp["role"], emp["job_title"], emp["anniversary_date"]
            ))
        conn.commit()

    # Seed or verify missing attributes on existing mock employees
    cursor.execute("UPDATE employees SET email = 'sarah@company.com', password_hash = 'pbkdf2:sha256:password123', role = 'Employee', job_title = 'Senior Engineer', anniversary_date = '06-26' WHERE id = '1'")
    cursor.execute("UPDATE employees SET email = 'marcus@company.com', password_hash = 'pbkdf2:sha256:password123', role = 'Employee', job_title = 'Lead Designer', anniversary_date = '07-01' WHERE id = '2'")
    cursor.execute("UPDATE employees SET caricature_url = '/static/caricature_1_1782451669.png' WHERE id = '1' AND (caricature_url = '/sarah_chen.png' OR caricature_url IS NULL)")
    cursor.execute("UPDATE wishes SET caricature_image_url = '/static/caricature_1_1782451669.png' WHERE caricature_image_url = '/sarah_chen.png'")
    conn.commit()

    # Seed Admin employee profile
    cursor.execute("SELECT COUNT(*) FROM employees WHERE id = 'admin'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO employees (
                id, name, gender, designation, department, photo_url, age, joining_date, 
                anniversary_milestone, hobbies, activities, caricature_url, caricature_name, caricature_model, status, progress, tags, timeline,
                email, password_hash, role, job_title, anniversary_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "admin", "HR Administrator", "Other", "HR Manager", "Human Resources", "/static/admin_avatar.png", 35, "2015-01-01", 
            "10th Anniversary", json.dumps(["Coaching", "Mentoring"]), json.dumps(["Event Planning"]), None, None, None, "Approved", 100, json.dumps(["HR", "Admin"]), json.dumps([]),
            "admin@company.com", "pbkdf2:sha256:admin123", "HR", "HR Manager", "01-01"
        ))
        conn.commit()

    # Seed mock wishes
    cursor.execute("SELECT COUNT(*) FROM wishes")
    if cursor.fetchone()[0] == 0:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        mock_wishes = [
            ("admin", "1", "Happy 5th Work Anniversary, Sarah! You're a rockstar senior engineer, and we love having you in Product!", "/static/caricature_1_1782451669.png", 1, now),
            ("2", "1", "Happy anniversary Sarah! Thanks for always helping with the complex database logic. Best engineering peer!", None, 0, now),
            ("1", "2", "Happy milestone Marcus! Your lead designer skills are amazing, looking forward to another decade together!", None, 0, now)
        ]
        cursor.executemany("""
            INSERT INTO wishes (sender_id, receiver_id, message_text, caricature_image_url, is_public, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, mock_wishes)
        conn.commit()

    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ==========================================
# Pydantic Schemas
# ==========================================

class TimelineEvent(BaseModel):
    time: str
    event: str
    status: str

class EmployeeResponse(BaseModel):
    id: str
    name: str
    gender: Optional[str] = "Other"
    designation: str
    department: str
    photo_url: str
    age: int
    joining_date: str
    anniversary_milestone: str
    hobbies: List[str]
    activities: List[str]
    caricature_url: Optional[str]
    caricature_name: Optional[str] = None
    caricature_model: Optional[str] = None
    status: str
    progress: int
    tags: List[str]
    timeline: List[TimelineEvent]
    email: Optional[str] = ""
    role: Optional[str] = "Employee"
    job_title: Optional[str] = ""
    anniversary_date: Optional[str] = ""

class LoginPayload(BaseModel):
    email: str
    password: str

class WishPayload(BaseModel):
    sender_id: str
    receiver_id: str
    message_text: str
    caricature_image_url: Optional[str] = None
    is_public: bool

class WishResponse(BaseModel):
    id: int
    sender_id: str
    sender_name: Optional[str] = ""
    receiver_id: str
    receiver_name: Optional[str] = ""
    message_text: str
    caricature_image_url: Optional[str] = None
    is_public: bool
    created_at: str


class UpdateEmployeePayload(BaseModel):
    name: str
    gender: str
    designation: str
    department: str
    age: int
    hobbies: List[str]
    activities: List[str]

class RegisterEmployeePayload(BaseModel):
    name: str
    gender: str
    role_title: str
    department: str
    milestone: str
    tags: List[str]
    age: int
    hobbies: List[str]
    activities: List[str]

class CanvasRenderRequest(BaseModel):
    emp_id: str
    style: str
    backdrop: str

class CanvasSaveRequest(BaseModel):
    emp_id: str
    preview_url: str
    style: str
    backdrop: str

class TagPayload(BaseModel):
    tag: str

def make_employee_response(row) -> EmployeeResponse:
    c_name = None
    try:
        c_name = row["caricature_name"]
    except (IndexError, KeyError, sqlite3.OperationalError):
        pass
        
    c_model = None
    try:
        c_model = row["caricature_model"]
    except (IndexError, KeyError, sqlite3.OperationalError):
        pass
        
    gender = "Other"
    try:
        if "gender" in row.keys() and row["gender"]:
            gender = row["gender"]
    except (IndexError, KeyError, sqlite3.OperationalError, AttributeError):
        try:
            if row["gender"]:
                gender = row["gender"]
        except Exception:
            pass

    email = ""
    try:
        if "email" in row.keys() and row["email"]:
            email = row["email"]
    except Exception:
        try:
            if row["email"]:
                email = row["email"]
        except Exception:
            pass

    role = "Employee"
    try:
        if "role" in row.keys() and row["role"]:
            role = row["role"]
    except Exception:
        try:
            if row["role"]:
                role = row["role"]
        except Exception:
            pass

    job_title = ""
    try:
        if "job_title" in row.keys() and row["job_title"]:
            job_title = row["job_title"]
    except Exception:
        try:
            if row["job_title"]:
                job_title = row["job_title"]
        except Exception:
            pass

    anniversary_date = ""
    try:
        if "anniversary_date" in row.keys() and row["anniversary_date"]:
            anniversary_date = row["anniversary_date"]
    except Exception:
        try:
            if row["anniversary_date"]:
                anniversary_date = row["anniversary_date"]
        except Exception:
            pass

    return EmployeeResponse(
        id=row["id"],
        name=row["name"],
        gender=gender,
        designation=row["designation"],
        department=row["department"],
        photo_url=row["photo_url"],
        age=row["age"],
        joining_date=row["joining_date"],
        anniversary_milestone=row["anniversary_milestone"],
        hobbies=json.loads(row["hobbies"]),
        activities=json.loads(row["activities"]),
        caricature_url=row["caricature_url"],
        caricature_name=c_name,
        caricature_model=c_model,
        status=row["status"],
        progress=row["progress"],
        tags=json.loads(row["tags"]),
        timeline=json.loads(row["timeline"]),
        email=email,
        role=role,
        job_title=job_title or row["designation"],
        anniversary_date=anniversary_date
    )


# ==========================================
# REST API Handlers
# ==========================================

@app.get("/api/employees", response_model=List[EmployeeResponse])
async def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees")
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        result.append(make_employee_response(row))
    return result

# ==========================================
# Async Generation Functions
# ==========================================

async def generate_caricature_card_helper(row):
    from PIL import Image
    import shutil
    import cv2
    import onnxruntime as ort
    import numpy as np
    import time

    emp_id = row["id"]
    name = row["name"]
    photo_url = row["photo_url"]

    static_dir = os.path.join(os.path.dirname(__file__), "static")
    photo_filename = photo_url.replace("/static/", "").lstrip("/")
    photo_path = os.path.join(static_dir, photo_filename)

    if not os.path.exists(photo_path):
        raise FileNotFoundError(f"Original photo not found at path: {photo_path}. Cannot proceed with AI generation.")

    # Clean up old caricature files to prevent disk bloat
    for fname in os.listdir(static_dir):
        if fname.startswith(f"caricature_{emp_id}_") or fname == f"caricature_{emp_id}.png":
            try:
                os.remove(os.path.join(static_dir, fname))
            except Exception as e:
                print(f"Warning: Failed to clean up old file {fname}: {e}")
                
    timestamp = int(time.time())
    output_filename = f"caricature_{emp_id}_{timestamp}.png"
    output_path = os.path.join(static_dir, output_filename)

    # ── Step 1: Detect face using OpenCV Haar Cascades ──
    print(f"[{name}] Initiating face detection on: {photo_path}...")
    img = cv2.imread(photo_path)
    if img is None:
        raise ValueError(f"Failed to read image at path: {photo_path}")
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
    
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))
    
    x_det, y_det, w_det, h_det = 0, 0, 0, 0
    if len(faces) > 0:
        # Take the largest face
        faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
        x, y, w_face, h_face = faces[0]
        x_det, y_det, w_det, h_det = int(x), int(y), int(w_face), int(h_face)
        
        # Calculate square crop box with 45% margin to capture head and shoulders
        margin_x = int(w_face * 0.45)
        margin_y = int(h_face * 0.45)
        img_h, img_w, _ = img.shape
        
        center_x = x + w_face // 2
        center_y = y + h_face // 2
        
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(img_w, x + w_face + margin_x)
        y2 = min(img_h, y + h_face + margin_y)
        
        # Square up the crop
        side = min(x2 - x1, y2 - y1)
        x1 = max(0, center_x - side // 2)
        y1 = max(0, center_y - side // 2)
        x2 = min(img_w, x1 + side)
        y2 = min(img_h, y1 + side)
        
        cropped = img[y1:y2, x1:x2]
    else:
        # Fallback: square center crop
        img_h, img_w, _ = img.shape
        side = min(img_h, img_w)
        x1 = (img_w - side) // 2
        y1 = (img_h - side) // 2
        cropped = img[y1:y1+side, x1:x1+side]

    # ── Console logging indicating face-aligned image-to-image conversion ──
    print("\n" + "="*80)
    print(f"[GEN_PIPELINE] CARICATURE GENERATION INITIATED FOR: {name} (ID: {emp_id})")
    print(f"[GEN_PIPELINE] Method: Face-Aligned local ONNX style transfer (No text-based generation)")
    print(f"[GEN_PIPELINE] Engine: AnimeGANv2 (face_paint_512_v2_0.onnx)")
    print(f"[GEN_PIPELINE] Input Photo: {photo_path}")
    if len(faces) > 0:
        print(f"[GEN_PIPELINE] Face Detected: x={x_det}, y={y_det}, w={w_det}, h={h_det}")
    else:
        print(f"[GEN_PIPELINE] Face Detected: None (Using center crop fallback)")
    print("="*80 + "\n")

    # ── Step 2: Load local face paint ONNX model ──
    model_path = os.path.join(os.path.dirname(__file__), "face_paint_512_v2_0.onnx")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"ONNX model file not found at: {model_path}")

    # ── Step 3: Resize cropped face area to 512x512 and format color to RGB ──
    resized = cv2.resize(cropped, (512, 512), interpolation=cv2.INTER_LANCZOS4)
    resized_rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)

    # ── Step 4: Preprocess for AnimeGANv2 input: Shape [1, 3, 512, 512], Range [-1, 1], CHW ──
    img_data = resized_rgb.astype(np.float32)
    img_data = np.transpose(img_data, (2, 0, 1))  # HWC -> CHW
    img_data = (img_data / 127.5) - 1.0
    img_data = np.expand_dims(img_data, axis=0)   # Shape: (1, 3, 512, 512)

    # ── Step 5: Run ONNX Inference Session ──
    try:
        def perform_onnx_inference():
            session = ort.InferenceSession(model_path)
            input_name = session.get_inputs()[0].name
            outputs = session.run(None, {input_name: img_data})
            return outputs[0][0]

        loop = asyncio.get_running_loop()
        output_data = await loop.run_in_executor(None, perform_onnx_inference)

        # ── Step 6: Postprocess: CHW -> HWC, Range [0, 255] ──
        output_data = np.transpose(output_data, (1, 2, 0))  # CHW -> HWC
        output_data = (output_data + 1.0) * 127.5
        output_data = np.clip(output_data, 0, 255).astype(np.uint8)

        # ── Step 7: Save Image ──
        out_img = Image.fromarray(output_data)
        out_img.save(output_path)

        print("\n" + "="*80)
        print(f"[GEN_PIPELINE] CARICATURE GENERATION COMPLETED FOR: {name}")
        print(f"[GEN_PIPELINE] Saved Output To: {output_path}")
        print("="*80 + "\n")

        # Sync with frontend public directory if it exists
        try:
            frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
            if os.path.exists(frontend_pub_dir):
                # Clean old public directory files for this employee
                for fname in os.listdir(frontend_pub_dir):
                    if fname.startswith(f"caricature_{emp_id}_") or fname == f"caricature_{emp_id}.png":
                        try:
                            os.remove(os.path.join(frontend_pub_dir, fname))
                        except Exception as e:
                            print(f"Failed to remove old public file {fname}: {e}")
                
                shutil.copyfile(output_path, os.path.join(frontend_pub_dir, output_filename))
        except Exception as sync_err:
            print(f"Warning: Failed to sync image to frontend directory: {sync_err}")

        return f"/static/{output_filename}", "ONNX_AnimeGANv2_FaceAligned"

    except Exception as e:
        print(f"[GEN_PIPELINE] Error running local style transfer: {e}")
        raise RuntimeError(f"Local Image-to-Image style transfer failed: {str(e)}")


def apply_onnx_style(cropped_512: np.ndarray, model_name: str) -> np.ndarray:
    model_path = os.path.join(os.path.dirname(__file__), model_name)
    if not os.path.exists(model_path):
        print(f"[ONNX_STYLE] Model not found: {model_path}. Returning original cropped face.")
        return cropped_512.copy()
        
    resized_rgb = cv2.cvtColor(cropped_512, cv2.COLOR_BGR2RGB)
    img_data = resized_rgb.astype(np.float32)
    img_data = np.transpose(img_data, (2, 0, 1))
    img_data = (img_data / 127.5) - 1.0
    img_data = np.expand_dims(img_data, axis=0)
    
    try:
        session = ort.InferenceSession(model_path)
        input_name = session.get_inputs()[0].name
        outputs = session.run(None, {input_name: img_data})
        output_data = outputs[0][0]
        output_data = np.transpose(output_data, (1, 2, 0))
        output_data = (output_data + 1.0) * 127.5
        return cv2.cvtColor(np.clip(output_data, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    except Exception as e:
        print(f"[ONNX_STYLE] Inference failed for {model_name}: {e}. Returning original.")
        return cropped_512.copy()

def apply_pixel_art(img_bgr: np.ndarray) -> np.ndarray:
    h, w = img_bgr.shape[:2]
    pixel_size = 64
    small = cv2.resize(img_bgr, (pixel_size, pixel_size), interpolation=cv2.INTER_LINEAR)
    quant = (small // 32) * 32 + 16
    quant = np.clip(quant, 0, 255).astype(np.uint8)
    pixelated = cv2.resize(quant, (w, h), interpolation=cv2.INTER_NEAREST)
    return pixelated

def apply_oil_painting(img_bgr: np.ndarray) -> np.ndarray:
    shifted = cv2.pyrMeanShiftFiltering(img_bgr, sp=10, sr=25)
    hsv = cv2.cvtColor(shifted, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:,:,1] = np.clip(hsv[:,:,1] * 1.3, 0, 255)
    hsv[:,:,2] = np.clip(hsv[:,:,2] * 1.05, 0, 255)
    painterly = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    kernel = np.array([[0, -0.5, 0], [-0.5, 3, -0.5], [0, -0.5, 0]], dtype=np.float32)
    sharpened = cv2.filter2D(painterly, -1, kernel)
    return sharpened

def apply_pop_art(img_bgr: np.ndarray) -> np.ndarray:
    small = cv2.resize(img_bgr, (256, 256), interpolation=cv2.INTER_LANCZOS4)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 9, 5)
    
    def create_quadrant(bg, face, shadow, edge_color):
        quad = np.zeros((256, 256, 3), dtype=np.uint8)
        mask_shadow = blurred < 90
        mask_midtone = (blurred >= 90) & (blurred < 170)
        mask_highlight = blurred >= 170
        
        quad[mask_highlight] = bg
        quad[mask_midtone] = face
        quad[mask_shadow] = shadow
        
        edge_mask = edges == 0
        quad[edge_mask] = edge_color
        return quad
        
    q1 = create_quadrant(bg=(0, 240, 240), face=(180, 50, 255), shadow=(255, 50, 0), edge_color=(0, 0, 0))
    q2 = create_quadrant(bg=(240, 240, 0), face=(240, 0, 240), shadow=(0, 240, 240), edge_color=(40, 0, 40))
    q3 = create_quadrant(bg=(0, 240, 0), face=(180, 0, 100), shadow=(0, 100, 240), edge_color=(20, 20, 20))
    q4 = create_quadrant(bg=(0, 120, 240), face=(240, 240, 0), shadow=(240, 0, 240), edge_color=(0, 0, 80))
    
    top = np.hstack((q1, q2))
    bottom = np.hstack((q3, q4))
    combined = np.vstack((top, bottom))
    return cv2.resize(combined, (512, 512), interpolation=cv2.INTER_NEAREST)

def apply_charcoal_sketch(img_bgr: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    smoothed = cv2.bilateralFilter(gray, 9, 75, 75)
    inv = 255 - smoothed
    blur = cv2.GaussianBlur(inv, (21, 21), 0)
    sketch = cv2.divide(smoothed, 255 - blur, scale=256.0)
    
    noise = np.random.normal(0, 15, gray.shape).astype(np.float32)
    sketch_f = sketch.astype(np.float32)
    sketch_f = 255.0 * np.power(sketch_f / 255.0, 2.5)
    
    sketch_with_noise = sketch_f + noise * (1.0 - sketch_f / 255.0)
    sketch_with_noise = np.clip(sketch_with_noise, 0, 255).astype(np.uint8)
    
    smudged = cv2.medianBlur(sketch_with_noise, 3)
    return cv2.cvtColor(smudged, cv2.COLOR_GRAY2BGR)

def apply_pencil_sketch(img_bgr: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    inv = 255 - gray
    blur = cv2.GaussianBlur(inv, (31, 31), 0)
    sketch = cv2.divide(gray, 255 - blur, scale=256.0)
    
    # Enhance the contrast and darken pencil lines to make them clearly visible
    sketch_f = sketch.astype(np.float32)
    # Apply gamma scaling to darken the gray lines (midtones) significantly
    sketch_f = 255.0 * np.power(sketch_f / 255.0, 2.2)
    sketch = np.clip(sketch_f, 0, 255).astype(np.uint8)
    
    return cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)

def apply_watercolor(img_bgr: np.ndarray) -> np.ndarray:
    tmp = img_bgr.copy()
    for _ in range(3):
        tmp = cv2.bilateralFilter(tmp, d=9, sigmaColor=75, sigmaSpace=75)
    hsv = cv2.cvtColor(tmp, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:,:,1] = np.clip(hsv[:,:,1] * 1.3, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

def apply_cartoon(img_bgr: np.ndarray) -> np.ndarray:
    color = img_bgr.copy()
    for _ in range(4):
        color = cv2.bilateralFilter(color, d=9, sigmaColor=50, sigmaSpace=50)
    div = 32
    quantized = (color // div) * div + div // 2
    quantized = np.clip(quantized, 0, 255).astype(np.uint8)
    
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    return cv2.bitwise_and(quantized, edges_color)

def generate_backdrop(theme_name: str) -> np.ndarray:
    bg = np.zeros((512, 512, 3), dtype=np.uint8)
    if theme_name == "sunset":
        for y in range(512):
            r = int(75 + (180 - 75) * (y / 512.0))
            g = int(20 + (100 - 20) * (y / 512.0))
            b = int(120 + (20 - 120) * (y / 512.0))
            bg[y, :] = [b, g, r]
        cv2.fillPoly(bg, [np.array([[0, 512], [150, 400], [300, 512]], dtype=np.int32)], (45, 10, 30))
        cv2.fillPoly(bg, [np.array([[200, 512], [380, 360], [512, 512]], dtype=np.int32)], (30, 5, 20))
    elif theme_name == "matrix":
        bg[:] = (10, 15, 10)
        import random
        for col in range(8, 512, 16):
            length = random.randint(5, 15)
            start_y = random.randint(0, 512)
            for i in range(length):
                char = random.choice(["0", "1"])
                y = (start_y + i * 16) % 512
                opacity = int(100 + 155 * (i / length))
                cv2.putText(bg, char, (col, y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, opacity, 0), 1, cv2.LINE_AA)
    elif theme_name == "office":
        for y in range(512):
            for x in range(512):
                dist = np.sqrt((x - 256)**2 + (y - 256)**2)
                factor = np.clip(1.0 - (dist / 360.0), 0, 1)
                r = int(10 + (40 - 10) * factor)
                g = int(20 + (70 - 20) * factor)
                b = int(45 + (130 - 45) * factor)
                bg[y, x] = [b, g, r]
        overlay = bg.copy()
        cv2.circle(overlay, (100, 100), 150, (80, 60, 20), -1)
        cv2.circle(overlay, (450, 400), 200, (100, 40, 10), -1)
        cv2.addWeighted(overlay, 0.15, bg, 0.85, 0, bg)
    elif theme_name == "neon":
        bg[:] = (18, 15, 15)
        cv2.rectangle(bg, (5, 5), (507, 507), (224, 0, 255), 2)
        cv2.rectangle(bg, (15, 15), (497, 497), (255, 229, 0), 1)
    else:
        for y in range(512):
            val = int(15 + 20 * (y / 512.0))
            bg[y, :] = (val + 5, val, val)
    return bg

def composite_face_on_backdrop(face_img: np.ndarray, backdrop_img: np.ndarray) -> np.ndarray:
    h_b, w_b, _ = backdrop_img.shape
    h_f, w_f, _ = face_img.shape
    
    mask = np.zeros((h_f, w_f), dtype=np.uint8)
    cv2.circle(mask, (w_f // 2, h_f // 2), int(w_f * 0.44), 255, -1)
    mask_blur = cv2.GaussianBlur(mask, (35, 35), 0)
    
    mask_norm = mask_blur.astype(float) / 255.0
    mask_norm = np.expand_dims(mask_norm, axis=2)
    
    y_off = (h_b - h_f) // 2
    x_off = (w_b - w_f) // 2
    
    roi = backdrop_img[y_off:y_off+h_f, x_off:x_off+w_f]
    blended_roi = face_img * mask_norm + roi * (1.0 - mask_norm)
    blended_roi = np.clip(blended_roi, 0, 255).astype(np.uint8)
    
    composite = backdrop_img.copy()
    composite[y_off:y_off+h_f, x_off:x_off+w_f] = blended_roi
    
    cv2.circle(composite, (w_b // 2, h_b // 2), int(w_f * 0.44), (255, 229, 0), 2, cv2.LINE_AA)
    
    return composite


async def simulate_generation(emp_id: str):
    progress_steps = [25, 50, 75, 100]
    try:
        for p in progress_steps:
            await asyncio.sleep(1.5)
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
            row = cursor.fetchone()
            if not row or row["status"] != "Generating":
                conn.close()
                break
                
            timeline = json.loads(row["timeline"])
            
            event_name = "Sketch Rendered"
            if p == 25:
                event_name = "Sketch Rendered (25%)"
            elif p == 50:
                event_name = "Style Transfer Applied (50%)"
            elif p == 75:
                event_name = "Style Transfer Applied (75%)"
            elif p == 100:
                event_name = "Generation Complete"
                
            if p == 100:
                caricature_url = None
                caricature_name = None
                actual_model = "unknown"
                try:
                    caricature_url, actual_model = await generate_caricature_card_helper(row)
                    if caricature_url:
                        caricature_name = os.path.basename(caricature_url)
                except Exception as e:
                    print(f"Error generating dynamic caricature card: {e}")
                
                event_desc = f"{event_name} ({actual_model})" if actual_model else event_name
                new_timeline = [
                    {"time": "Just Now", "event": event_desc, "status": "completed" if caricature_url else "failed"},
                    *timeline
                ]
                cursor.execute("""
                    UPDATE employees
                    SET progress = 100, status = ?, caricature_url = ?, caricature_name = ?, caricature_model = ?, timeline = ?
                    WHERE id = ?
                """, ("Ready for Review" if caricature_url else "Generation Failed", caricature_url, caricature_name, actual_model, json.dumps(new_timeline), emp_id))
            else:
                new_timeline = [
                    {"time": "Just Now", "event": event_name, "status": "in-progress"},
                    *timeline
                ]
                cursor.execute("""
                    UPDATE employees
                    SET progress = ?, timeline = ?
                    WHERE id = ?
                """, (p, json.dumps(new_timeline), emp_id))
                
            conn.commit()
            conn.close()
    except asyncio.CancelledError:
        print(f"Generation task for employee {emp_id} was cancelled.")
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE employees
                SET status = 'Awaiting Stylization', progress = 0
                WHERE id = ? AND status = 'Generating'
            """, (emp_id,))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Failed to reset employee status on cancellation: {e}")
        raise

@app.post("/api/employees/{emp_id}/generate", response_model=EmployeeResponse)
async def generate_caricature(emp_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    if row["status"] == "Generating":
        conn.close()
        raise HTTPException(status_code=400, detail="Generation already in progress")
        
    initial_timeline = [
        {"time": "Just Now", "event": "Queue Initiated", "status": "completed"},
        {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"}
    ]
    
    cursor.execute("""
        UPDATE employees
        SET status = 'Generating', progress = 0, timeline = ?
        WHERE id = ?
    """, (json.dumps(initial_timeline), emp_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    task = asyncio.create_task(simulate_generation(emp_id))
    active_tasks.add(task)
    task.add_done_callback(active_tasks.discard)
    
    return make_employee_response(updated_row)

@app.post("/api/employees/{emp_id}/approve", response_model=EmployeeResponse)
async def approve_milestone(emp_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    timeline = json.loads(row["timeline"])
    new_timeline = [
        {"time": "Just Now", "event": "Approved & Scheduled", "status": "completed"},
        *timeline
    ]
    
    cursor.execute("""
        UPDATE employees
        SET status = 'Approved', timeline = ?
        WHERE id = ?
    """, (json.dumps(new_timeline), emp_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

@app.post("/api/employees/{emp_id}/upload-photo", response_model=EmployeeResponse)
async def upload_photo(emp_id: str, file: UploadFile = File(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    filename = file.filename
    clean_filename = "".join([c for c in filename if c.isalnum() or c in (".", "_", "-")])
    save_name = f"emp_{emp_id}_{clean_filename}"
    save_path = os.path.join(static_dir, save_name)
    
    try:
        contents = await file.read()
        with open(save_path, "wb") as buffer:
            buffer.write(contents)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded photo: {str(e)}")

    photo_url = f"/static/{save_name}"
    timeline = json.loads(row["timeline"])
    new_timeline = [
        {"time": "Just Now", "event": "Original Photo Updated", "status": "completed"},
        {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"},
        *timeline
    ]
    
    cursor.execute("""
        UPDATE employees
        SET photo_url = ?, caricature_url = NULL, caricature_name = NULL, status = 'Awaiting Stylization', progress = 0, timeline = ?
        WHERE id = ?
    """, (photo_url, json.dumps(new_timeline), emp_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

@app.post("/api/picture-canvas/render")
async def render_picture_canvas(req: CanvasRenderRequest):
    emp_id = req.emp_id
    style_type = req.style
    backdrop_theme = req.backdrop
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    photo_url = row["photo_url"]
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    photo_filename = photo_url.replace("/static/", "").lstrip("/")
    photo_path = os.path.join(static_dir, photo_filename)
    
    if not os.path.exists(photo_path):
        raise HTTPException(status_code=400, detail="Original photo not found on disk")
        
    img = cv2.imread(photo_path)
    if img is None:
        raise HTTPException(status_code=500, detail="Failed to read image")
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))
    
    if len(faces) > 0:
        faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
        x, y, w_face, h_face = faces[0]
        margin_x = int(w_face * 0.45)
        margin_y = int(h_face * 0.45)
        img_h, img_w, _ = img.shape
        center_x = x + w_face // 2
        center_y = y + h_face // 2
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(img_w, x + w_face + margin_x)
        y2 = min(img_h, y + h_face + margin_y)
        side = min(x2 - x1, y2 - y1)
        x1 = max(0, center_x - side // 2)
        y1 = max(0, center_y - side // 2)
        x2 = min(img_w, x1 + side)
        y2 = min(img_h, y1 + side)
        cropped = img[y1:y2, x1:x2]
    else:
        img_h, img_w, _ = img.shape
        side = min(img_h, img_w)
        x1 = (img_w - side) // 2
        y1 = (img_h - side) // 2
        cropped = img[y1:y1+side, x1:x1+side]
        
    cropped_512 = cv2.resize(cropped, (512, 512), interpolation=cv2.INTER_LANCZOS4)
    
    if style_type == "Anime":
        styled_bgr = apply_onnx_style(cropped_512, "face_paint_512_v2_0.onnx")
    elif style_type == "Hayao":
        styled_bgr = apply_onnx_style(cropped_512, "AnimeGANv2_Hayao.onnx")
    elif style_type == "Shinkai":
        styled_bgr = apply_onnx_style(cropped_512, "AnimeGANv2_Shinkai.onnx")
    elif style_type == "Paprika":
        styled_bgr = apply_onnx_style(cropped_512, "AnimeGANv2_Paprika.onnx")
    elif style_type == "Sketch":
        styled_bgr = apply_pencil_sketch(cropped_512)
    elif style_type == "Charcoal":
        styled_bgr = apply_charcoal_sketch(cropped_512)
    elif style_type == "Watercolor":
        styled_bgr = apply_watercolor(cropped_512)
    elif style_type == "Cartoon":
        styled_bgr = apply_cartoon(cropped_512)
    elif style_type == "PixelArt":
        styled_bgr = apply_pixel_art(cropped_512)
    elif style_type == "OilPainting":
        styled_bgr = apply_oil_painting(cropped_512)
    elif style_type == "PopArt":
        styled_bgr = apply_pop_art(cropped_512)
    else:
        styled_bgr = cropped_512.copy()
        
    if backdrop_theme != "none":
        backdrop = generate_backdrop(backdrop_theme)
        styled_resized = cv2.resize(styled_bgr, (380, 380), interpolation=cv2.INTER_LANCZOS4)
        final_img = composite_face_on_backdrop(styled_resized, backdrop)
    else:
        final_img = styled_bgr
        
    preview_filename = f"canvas_preview_{emp_id}.png"
    preview_path = os.path.join(static_dir, preview_filename)
    
    cv2.imwrite(preview_path, final_img)
    
    try:
        frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
        if os.path.exists(frontend_pub_dir):
            shutil.copyfile(preview_path, os.path.join(frontend_pub_dir, preview_filename))
    except Exception as e:
        print(f"Warning: Failed to sync preview image to public directory: {e}")
        
    return {"preview_url": f"/static/{preview_filename}?t={int(time.time())}"}

@app.post("/api/picture-canvas/save", response_model=EmployeeResponse)
async def save_picture_canvas(req: CanvasSaveRequest):
    emp_id = req.emp_id
    style_type = req.style
    backdrop_theme = req.backdrop
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    preview_filename = f"canvas_preview_{emp_id}.png"
    preview_path = os.path.join(static_dir, preview_filename)
    
    if not os.path.exists(preview_path):
        conn.close()
        raise HTTPException(status_code=400, detail="No preview image found. Please render first.")
        
    timestamp = int(time.time())
    output_filename = f"caricature_{emp_id}_{timestamp}.png"
    output_path = os.path.join(static_dir, output_filename)
    
    shutil.copyfile(preview_path, output_path)
    
    try:
        frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
        if os.path.exists(frontend_pub_dir):
            for fname in os.listdir(frontend_pub_dir):
                if fname.startswith(f"caricature_{emp_id}_") or fname == f"caricature_{emp_id}.png":
                    try:
                        os.remove(os.path.join(frontend_pub_dir, fname))
                    except:
                        pass
            shutil.copyfile(output_path, os.path.join(frontend_pub_dir, output_filename))
    except Exception as e:
        print(f"Warning: Failed to sync customized image: {e}")
        
    for fname in os.listdir(static_dir):
        if (fname.startswith(f"caricature_{emp_id}_") or fname == f"caricature_{emp_id}.png") and fname != output_filename:
            try:
                os.remove(os.path.join(static_dir, fname))
            except:
                pass
                
    timeline = json.loads(row["timeline"])
    event_desc = f"Custom Caricature Applied (Style: {style_type}, Backdrop: {backdrop_theme})"
    new_timeline = [
        {"time": "Just Now", "event": event_desc, "status": "completed"},
        *timeline
    ]
    
    cursor.execute("""
        UPDATE employees
        SET progress = 100, status = 'Ready for Review', caricature_url = ?, caricature_name = ?, caricature_model = ?, timeline = ?
        WHERE id = ?
    """, (f"/static/{output_filename}", output_filename, f"Customizer: {style_type} + {backdrop_theme}", json.dumps(new_timeline), emp_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

@app.post("/api/employees/{emp_id}/tags", response_model=EmployeeResponse)
async def add_tag(emp_id: str, payload: TagPayload):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    tags = json.loads(row["tags"])
    new_tag = payload.tag.strip()
    if new_tag and new_tag not in tags:
        tags.append(new_tag)
        
    cursor.execute("""
        UPDATE employees
        SET tags = ?
        WHERE id = ?
    """, (json.dumps(tags), emp_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

@app.delete("/api/employees/{emp_id}/tags/{tag}", response_model=EmployeeResponse)
async def remove_tag(emp_id: str, tag: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    tags = json.loads(row["tags"])
    if tag in tags:
        tags.remove(tag)
        
    cursor.execute("""
        UPDATE employees
        SET tags = ?
        WHERE id = ?
    """, (json.dumps(tags), emp_id))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

@app.post("/api/employees", response_model=EmployeeResponse)
async def register_employee(payload: RegisterEmployeePayload):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Generate sequential string ID
    cursor.execute("SELECT id FROM employees")
    ids = [int(x[0]) for x in cursor.fetchall() if x[0].isdigit()]
    new_id = str(max(ids) + 1) if ids else "1"
    
    import datetime
    today_str = datetime.date.today().isoformat()
    
    initial_timeline = [
        {"time": "Just Now", "event": "Milestone Registered", "status": "completed"},
        {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"}
    ]
    
    cursor.execute("""
        INSERT INTO employees (
            id, name, gender, designation, department, photo_url, age, joining_date, 
            anniversary_milestone, hobbies, activities, caricature_url, caricature_name, status, progress, tags, timeline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id,
        payload.name,
        payload.gender,
        payload.role_title,
        payload.department,
        "/static/default_avatar.png", # placeholder photo
        payload.age,
        today_str,
        payload.milestone,
        json.dumps(payload.hobbies),
        json.dumps(payload.activities),
        None,
        None,
        "Awaiting Stylization",
        0,
        json.dumps(payload.tags),
        json.dumps(initial_timeline)
    ))
    
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(row)

@app.post("/api/employees/{emp_id}/update", response_model=EmployeeResponse)
async def update_employee(emp_id: str, payload: UpdateEmployeePayload):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    timeline = json.loads(row["timeline"])
    new_timeline = [
        {"time": "Just Now", "event": "Profile Updated (Reset to Awaiting Stylization)", "status": "completed"},
        {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"},
        *timeline
    ]
    
    cursor.execute("""
        UPDATE employees
        SET name = ?, gender = ?, designation = ?, department = ?, age = ?, 
            hobbies = ?, activities = ?, status = 'Awaiting Stylization', progress = 0, 
            caricature_url = NULL, caricature_name = NULL, timeline = ?
        WHERE id = ?
    """, (
        payload.name,
        payload.gender,
        payload.designation,
        payload.department,
        payload.age,
        json.dumps(payload.hobbies),
        json.dumps(payload.activities),
        json.dumps(new_timeline),
        emp_id
    ))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

@app.delete("/api/employees/{emp_id}")
async def delete_employee(emp_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Employee not found")
        
    cursor.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
    conn.commit()
    conn.close()
    
    # Clean up associated files (photos and caricatures) on disk to prevent bloat
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    if os.path.exists(static_dir):
        for fname in os.listdir(static_dir):
            if (fname.startswith(f"caricature_{emp_id}_") or 
                fname == f"caricature_{emp_id}.png" or 
                fname.startswith(f"emp_{emp_id}_")):
                try:
                    os.remove(os.path.join(static_dir, fname))
                except Exception as e:
                    print(f"Failed to remove file {fname} on employee delete: {e}")
                    
    # Sync with frontend public directory if it exists
    try:
        frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
        if os.path.exists(frontend_pub_dir):
            for fname in os.listdir(frontend_pub_dir):
                if (fname.startswith(f"caricature_{emp_id}_") or 
                    fname == f"caricature_{emp_id}.png" or 
                    fname.startswith(f"emp_{emp_id}_")):
                    try:
                        os.remove(os.path.join(frontend_pub_dir, fname))
                    except Exception as e:
                        print(f"Failed to remove public file {fname} on employee delete: {e}")
    except Exception as e:
        print(f"Warning: Failed to clean up frontend public directory: {e}")
        
    return {"message": f"Employee {emp_id} deleted successfully"}

# ==========================================
# Authentication & Wishing System Endpoints
# ==========================================

@app.post("/api/login")
async def login_user(payload: LoginPayload):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE email = ?", (payload.email,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    db_pass = row["password_hash"]
    # Verify simple hashed password prefix or exact text
    expected = f"pbkdf2:sha256:{payload.password}"
    if db_pass != expected and db_pass != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    emp_res = make_employee_response(row)
    return {
        "token": f"mock-jwt-token-for-{emp_res.id}",
        "user": emp_res
    }

@app.get("/api/wishes", response_model=List[WishResponse])
async def get_wishes(receiver_id: Optional[str] = None, is_public: Optional[int] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT w.*, e1.name as sender_name, e2.name as receiver_name 
        FROM wishes w
        LEFT JOIN employees e1 ON w.sender_id = e1.id
        LEFT JOIN employees e2 ON w.receiver_id = e2.id
        WHERE 1=1
    """
    params = []
    if receiver_id:
        query += " AND w.receiver_id = ?"
        params.append(receiver_id)
    if is_public is not None:
        query += " AND w.is_public = ?"
        params.append(is_public)
        
    query += " ORDER BY w.id DESC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    res = []
    for r in rows:
        res.append(WishResponse(
            id=r["id"],
            sender_id=r["sender_id"],
            sender_name=r["sender_name"] or "Anonymous",
            receiver_id=r["receiver_id"],
            receiver_name=r["receiver_name"] or "Anonymous",
            message_text=r["message_text"],
            caricature_image_url=r["caricature_image_url"],
            is_public=bool(r["is_public"]),
            created_at=r["created_at"]
        ))
    return res

@app.post("/api/wishes", response_model=WishResponse)
async def create_wish(payload: WishPayload):
    conn = get_db_connection()
    cursor = conn.cursor()
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO wishes (sender_id, receiver_id, message_text, caricature_image_url, is_public, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (payload.sender_id, payload.receiver_id, payload.message_text, payload.caricature_image_url, 1 if payload.is_public else 0, created_at))
    conn.commit()
    wish_id = cursor.lastrowid
    
    cursor.execute("""
        SELECT w.*, e1.name as sender_name, e2.name as receiver_name 
        FROM wishes w
        LEFT JOIN employees e1 ON w.sender_id = e1.id
        LEFT JOIN employees e2 ON w.receiver_id = e2.id
        WHERE w.id = ?
    """, (wish_id,))
    r = cursor.fetchone()
    conn.close()
    
    return WishResponse(
        id=r["id"],
        sender_id=r["sender_id"],
        sender_name=r["sender_name"] or "Anonymous",
        receiver_id=r["receiver_id"],
        receiver_name=r["receiver_name"] or "Anonymous",
        message_text=r["message_text"],
        caricature_image_url=r["caricature_image_url"],
        is_public=bool(r["is_public"]),
        created_at=r["created_at"]
    )

@app.post("/api/wishes/upload-caricature")
async def upload_wish_caricature(file: UploadFile = File(...)):
    filename = file.filename
    clean_filename = "".join([c for c in filename if c.isalnum() or c in (".", "_", "-")])
    save_name = f"wish_{int(time.time())}_{clean_filename}"
    save_path = os.path.join(static_dir, save_name)
    try:
        contents = await file.read()
        with open(save_path, "wb") as buffer:
            buffer.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save wish caricature: {str(e)}")
        
    try:
        frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
        if os.path.exists(frontend_pub_dir):
            shutil.copyfile(save_path, os.path.join(frontend_pub_dir, save_name))
    except Exception as sync_err:
        print(f"Warning: Failed to sync wish image: {sync_err}")
        
    return {"caricature_image_url": f"/static/{save_name}"}

@app.post("/api/wishes/generate-caricature")
async def generate_wish_caricature(file: UploadFile = File(...), style: str = Form("Anime")):
    # Save original temporarily
    filename = file.filename
    clean_filename = "".join([c for c in filename if c.isalnum() or c in (".", "_", "-")])
    temp_name = f"temp_wish_{int(time.time())}_{clean_filename}"
    temp_path = os.path.join(static_dir, temp_name)
    try:
        contents = await file.read()
        with open(temp_path, "wb") as buffer:
            buffer.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save temp file: {str(e)}")
        
    # Read the image and run style transfer
    img = cv2.imread(temp_path)
    if img is None:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=400, detail="Invalid image file")
        
    # Crop face or fallback to center crop
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))
    
    if len(faces) > 0:
        faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
        x, y, w_face, h_face = faces[0]
        margin_x = int(w_face * 0.45)
        margin_y = int(h_face * 0.45)
        img_h, img_w, _ = img.shape
        center_x = x + w_face // 2
        center_y = y + h_face // 2
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(img_w, x + w_face + margin_x)
        y2 = min(img_h, y + h_face + margin_y)
        side = min(x2 - x1, y2 - y1)
        x1 = max(0, center_x - side // 2)
        y1 = max(0, center_y - side // 2)
        x2 = min(img_w, x1 + side)
        y2 = min(img_h, y1 + side)
        cropped = img[y1:y2, x1:x2]
    else:
        img_h, img_w, _ = img.shape
        side = min(img_h, img_w)
        x1 = (img_w - side) // 2
        y1 = (img_h - side) // 2
        cropped = img[y1:y1+side, x1:x1+side]
        
    cropped_512 = cv2.resize(cropped, (512, 512), interpolation=cv2.INTER_LANCZOS4)
    
    # Apply style
    if style == "Anime":
        styled_bgr = apply_onnx_style(cropped_512, "face_paint_512_v2_0.onnx")
    elif style == "Hayao":
        styled_bgr = apply_onnx_style(cropped_512, "AnimeGANv2_Hayao.onnx")
    elif style == "Shinkai":
        styled_bgr = apply_onnx_style(cropped_512, "AnimeGANv2_Shinkai.onnx")
    elif style == "Paprika":
        styled_bgr = apply_onnx_style(cropped_512, "AnimeGANv2_Paprika.onnx")
    elif style == "Sketch":
        styled_bgr = apply_pencil_sketch(cropped_512)
    elif style == "Charcoal":
        styled_bgr = apply_charcoal_sketch(cropped_512)
    elif style == "Watercolor":
        styled_bgr = apply_watercolor(cropped_512)
    elif style == "Cartoon":
        styled_bgr = apply_cartoon(cropped_512)
    elif style == "PixelArt":
        styled_bgr = apply_pixel_art(cropped_512)
    elif style == "OilPainting":
        styled_bgr = apply_oil_painting(cropped_512)
    elif style == "PopArt":
        styled_bgr = apply_pop_art(cropped_512)
    else:
        styled_bgr = cropped_512.copy()
        
    # Save the styled result
    save_name = f"wish_caricature_{int(time.time())}_{clean_filename}"
    save_path = os.path.join(static_dir, save_name)
    cv2.imwrite(save_path, styled_bgr)
    
    # Clean up temp
    if os.path.exists(temp_path):
        os.remove(temp_path)
        
    # Sync with frontend public directory if it exists
    try:
        frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
        if os.path.exists(frontend_pub_dir):
            shutil.copyfile(save_path, os.path.join(frontend_pub_dir, save_name))
    except Exception as sync_err:
        print(f"Warning: Failed to sync wish caricature image: {sync_err}")
        
    return {"caricature_image_url": f"/static/{save_name}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)