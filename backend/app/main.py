import asyncio
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Set
import os
import sqlite3
import json
from google import genai
from google.genai import types
from contextlib import asynccontextmanager
import httpx
import io

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

def load_gemini_api_key() -> Optional[str]:
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        return api_key
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r") as f:
                for line in f:
                    if line.strip().startswith("GEMINI_API_KEY="):
                        return line.split("=")[1].strip()
        except Exception as e:
            print(f"Error reading .env file: {e}")
    return None

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
            status TEXT,
            progress INTEGER,
            tags TEXT,
            timeline TEXT
        )
    """)
    
    # Ensure caricature_name column exists (migration for existing db)
    try:
        cursor.execute("SELECT caricature_name FROM employees LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE employees ADD COLUMN caricature_name TEXT")
        conn.commit()

    # Check if empty, prepopulate fallback profiles
    cursor.execute("SELECT COUNT(*) FROM employees")
    if cursor.fetchone()[0] == 0:
        mock_employees = [
            {
                "id": "1",
                "name": "Sarah Chen",
                "designation": "Senior Engineer",
                "department": "Product",
                "photo_url": "/sarah_chen_original.png",
                "age": 29,
                "joining_date": "2021-06-15",
                "anniversary_milestone": "5th Anniversary",
                "hobbies": json.dumps(["Coffee Brewing", "Travel Photography", "Digital Art"]),
                "activities": json.dumps(["Hiking", "Tech Blogging", "Running"]),
                "caricature_url": "/sarah_chen.png",
                "caricature_name": "sarah_chen.png",
                "status": "Ready for Review",
                "progress": 100,
                "tags": json.dumps(["Coffee Lover", "Traveler", "Modern Vector", "Code Artist"]),
                "timeline": json.dumps([
                    {"time": "10:45 AM", "event": "Generation Complete", "status": "completed"},
                    {"time": "Yesterday, 4:20 PM", "event": "Style Refinement Applied", "status": "completed"},
                    {"time": "Yesterday, 2:15 PM", "event": "Initial Persona Created", "status": "completed"}
                ])
            },
            {
                "id": "2",
                "name": "Marcus Thorne",
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
                ])
            },
            {
                "id": "3",
                "name": "Alex Rivera",
                "designation": "DevOps Specialist",
                "department": "Engineering",
                "photo_url": "/alex_rivera_original.png",
                "age": 27,
                "joining_date": "2023-03-10",
                "anniversary_milestone": "3rd Anniversary",
                "hobbies": json.dumps(["Guitar Playing", "Skateboarding", "Retro Gaming"]),
                "activities": json.dumps(["Volunteering at Cat Shelter", "Cycling", "Gaming Tournaments"]),
                "caricature_url": "/alex_rivera.png",
                "caricature_name": "alex_rivera.png",
                "status": "Ready for Review",
                "progress": 100,
                "tags": json.dumps(["Skater", "Guitarist", "Minimalist", "Cat Dad"]),
                "timeline": json.dumps([
                    {"time": "09:15 AM", "event": "Queue Initiated", "status": "completed"},
                    {"time": "09:17 AM", "event": "Persona Extracted", "status": "completed"},
                    {"time": "09:20 AM", "event": "Sketch Rendered", "status": "completed"},
                    {"time": "09:23 AM", "event": "Style Transfer Applied", "status": "completed"},
                    {"time": "09:25 AM", "event": "Awaiting Final Review", "status": "in-progress"}
                ])
            },
            {
                "id": "4",
                "name": "Emily Vance",
                "designation": "HR Generalist",
                "department": "People",
                "photo_url": "/emily_vance_original.png",
                "age": 25,
                "joining_date": "2025-05-01",
                "anniversary_milestone": "1st Anniversary",
                "hobbies": json.dumps(["Reading Novels", "Baking", "Running"]),
                "activities": json.dumps(["Community Gardening", "Pilates", "Pet Training"]),
                "caricature_url": "/admin_avatar.png",
                "caricature_name": "admin_avatar.png",
                "status": "Approved",
                "progress": 100,
                "tags": json.dumps(["People Person", "Bookworm", "Runner"]),
                "timeline": json.dumps([
                    {"time": "02:00 PM", "event": "Queue Initiated", "status": "completed"},
                    {"time": "02:03 PM", "event": "Persona Extracted", "status": "completed"},
                    {"time": "02:06 PM", "event": "Sketch Rendered", "status": "completed"},
                    {"time": "02:09 PM", "event": "Style Transfer Applied", "status": "completed"},
                    {"time": "02:12 PM", "event": "Approved & Scheduled", "status": "completed"}
                ])
            },
            {
                "id": "5",
                "name": "Jessica Taylor",
                "designation": "Product Manager",
                "department": "Product",
                "photo_url": "/admin_avatar.png",
                "age": 31,
                "joining_date": "2021-11-20",
                "anniversary_milestone": "5th Anniversary",
                "hobbies": json.dumps(["Yoga", "Road Tripping", "Photography"]),
                "activities": json.dumps(["Running", "Cooking Classes", "Gardening"]),
                "caricature_url": None,
                "caricature_name": None,
                "status": "Awaiting Stylization",
                "progress": 0,
                "tags": json.dumps(["Analytics Expert", "Yoga Enthusiast", "Road Tripper"]),
                "timeline": json.dumps([
                    {"time": "Just Now", "event": "Milestone Registered", "status": "completed"},
                    {"time": "--:--", "event": "Awaiting Photo Upload", "status": "pending"}
                ])
            }
        ]
        for emp in mock_employees:
            cursor.execute("""
                INSERT INTO employees (
                    id, name, designation, department, photo_url, age, joining_date, 
                    anniversary_milestone, hobbies, activities, caricature_url, caricature_name, status, progress, tags, timeline
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                emp["id"], emp["name"], emp["designation"], emp["department"], emp["photo_url"],
                emp["age"], emp["joining_date"], emp["anniversary_milestone"], emp["hobbies"],
                emp["activities"], emp["caricature_url"], emp["caricature_name"], emp["status"], emp["progress"], emp["tags"], emp["timeline"]
            ))
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
    status: str
    progress: int
    tags: List[str]
    timeline: List[TimelineEvent]

class CreateEmployeePayload(BaseModel):
    name: str
    role_title: str
    department: str
    milestone: str
    tags: List[str]
    age: Optional[int] = 30
    hobbies: Optional[List[str]] = []
    activities: Optional[List[str]] = []

class UpdateEmployeePayload(BaseModel):
    name: str
    designation: str
    department: str
    age: int
    hobbies: List[str]
    activities: List[str]

class TagPayload(BaseModel):
    tag: str

def make_employee_response(row) -> EmployeeResponse:
    c_name = None
    try:
        c_name = row["caricature_name"]
    except (IndexError, KeyError, sqlite3.OperationalError):
        pass
    return EmployeeResponse(
        id=row["id"],
        name=row["name"],
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
        status=row["status"],
        progress=row["progress"],
        tags=json.loads(row["tags"]),
        timeline=json.loads(row["timeline"])
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

@app.post("/api/employees", response_model=EmployeeResponse)
async def create_employee(payload: CreateEmployeePayload):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM employees")
    ids = [int(r["id"]) for r in cursor.fetchall() if r["id"].isdigit()]
    next_id = str(max(ids) + 1 if ids else 1)
    
    joining_date = "2026-06-19"
    initial_timeline = [
        {"time": "Just Now", "event": "Milestone Registered", "status": "completed"},
        {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"}
    ]
    
    cursor.execute("""
        INSERT INTO employees (
            id, name, designation, department, photo_url, age, joining_date, 
            anniversary_milestone, hobbies, activities, caricature_url, caricature_name, status, progress, tags, timeline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        next_id, payload.name, payload.role_title, payload.department, "/admin_avatar.png",
        payload.age if payload.age is not None else 30, joining_date, payload.milestone,
        json.dumps(payload.hobbies if payload.hobbies else []),
        json.dumps(payload.activities if payload.activities else []),
        None, None, "Awaiting Stylization", 0, json.dumps(payload.tags if payload.tags else ["New Joiner"]),
        json.dumps(initial_timeline)
    ))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (next_id,))
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
        
    new_timeline = [
        {"time": "Just Now", "event": "Milestone Profile Updated", "status": "completed"},
        {"time": "--:--", "event": "Awaiting Stylization", "status": "pending"}
    ]
    
    cursor.execute("""
        UPDATE employees
        SET name = ?, designation = ?, department = ?, age = ?, hobbies = ?, activities = ?, 
            status = 'Awaiting Stylization', progress = 0, caricature_url = NULL, caricature_name = NULL, timeline = ?
        WHERE id = ?
    """, (
        payload.name, payload.designation, payload.department, payload.age,
        json.dumps(payload.hobbies), json.dumps(payload.activities), json.dumps(new_timeline),
        emp_id
    ))
    conn.commit()
    
    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    updated_row = cursor.fetchone()
    conn.close()
    
    return make_employee_response(updated_row)

# ==========================================
# Async Generation Background Loop
# ==========================================

# ==========================================
# Fixed Async Generation Functions
# ==========================================

async def generate_caricature_card_helper(row):
    from PIL import Image
    import os
    import json
    import io
    import urllib.request
    import urllib.error
    import shutil
    
    emp_id = row["id"]
    name = row["name"]
    hobbies = json.loads(row["hobbies"])
    activities = json.loads(row["activities"])
    photo_url = row["photo_url"]
    
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    photo_filename = photo_url.replace("/static/", "").lstrip("/")
    photo_path = os.path.join(static_dir, photo_filename)
    
    if not os.path.exists(photo_path):
        raise FileNotFoundError(f"Original photo not found at path: {photo_path}. Cannot proceed with AI generation.")
    
    # Process original photo locally
    photo_img = Image.open(photo_path).convert("RGBA")
    w, h = photo_img.size
    min_dim = min(w, h)
    left = (w - min_dim) / 2
    top = (h - min_dim) / 2
    right = (w + min_dim) / 2
    bottom = (h + min_dim) / 2
    photo_img = photo_img.crop((left, top, right, bottom))
    
    portrait_size = 720
    photo_img = photo_img.resize((portrait_size, portrait_size), Image.Resampling.LANCZOS)

    output_filename = f"caricature_{emp_id}.png"
    output_path = os.path.join(static_dir, output_filename)

    api_key = load_gemini_api_key()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing. AI generation requires a valid API key setup.")

    print(f"Starting Gemini description extraction for {name}...")
    client = genai.Client(api_key=api_key)
    
    # Save processed image to memory bytes for the google-genai SDK format
    img_byte_arr = io.BytesIO()
    photo_img.convert("RGB").save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()
    
    describe_prompt = f"""
    Analyze this photo of a person named {name}. Describe their physical appearance and likeness in high detail, focusing on:
    - Gender and approximate age.
    - Facial structure, chin shape, jawline, and cheeks.
    - Eyes (color, size, shape, eyelashes, and if they wear glasses).
    - Hair (style, parting, length, texture, color, and hairline).
    - Skin tone, complexion, and distinct facial marks or wrinkles.
    - Expression (smile, eyes, mouth shape).
    Provide a precise, high-fidelity depiction in under 100 words so that an image generator can accurately recreate this specific person's identity.
    Do not describe any background details.
    """
    
    try:
        print("Sending photo to gemini-2.5-flash-lite for portrait description...")
        describe_response = await client.aio.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[
                types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"), 
                describe_prompt
            ]
        )
        person_likeness = describe_response.text
        if not person_likeness:
            raise RuntimeError("Gemini returned an empty description for the portrait.")
        print(f"Likeness description obtained successfully!")
    except Exception as e:
        raise RuntimeError(f"Multimodal description extraction failed via gemini-2.5-flash-lite: {str(e)}")
    
    hobbies_str = ", ".join(hobbies) if hobbies else "none"
    activities_str = ", ".join(activities) if activities else "none"
    
    hobbies_activities_desc = ""
    if hobbies or activities:
        hobbies_activities_desc = f"Incorporate cartoonish thematic details representing their hobbies ({hobbies_str}) and activities ({activities_str}) in a playful way."
    
    imagen_prompt = f"""
    A premium 1024x1024 professional 2D vector illustration caricature avatar of a person.
    Likeness & features to retain: {person_likeness}.
    Style: Modern corporate cartoon caricature, clean bold outlines, flat cell shading with subtle gradients, vibrant and cheerful color palette, high-quality digital art sticker style.
    The character should look directly at the camera with a warm, confident smile, wearing professional business attire (a dark suit or blazer with a visible company lanyard) and holding relevant work tools.
    {hobbies_activities_desc}
    Background: Bright, colorful, abstract geometric pop-art background featuring clean shapes (triangles, circles, sunbursts, and squiggles) on a crisp white backdrop.
    Exclusions: NO realistic photo elements, NO dark filters, NO complex background environments, NO messy lines.
    """
    
    # Step 3: Run the Image Generation pipeline via Hugging Face FLUX.1-schnell
    try:
        hf_token = "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"
        print("Generating caricature image using Hugging Face (FLUX.1-schnell)...")
        HF_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
        
        # Build the payload string
        payload = json.dumps({"inputs": imagen_prompt}).encode("utf-8")
        
        # Configure native request headers
        req = urllib.request.Request(HF_API_URL, data=payload)
        req.add_header("Authorization", f"Bearer {hf_token}")
        req.add_header("Content-Type", "application/json")
        
        # Define a synchronous runner function to avoid blocking the async event loop
        def perform_native_fetch():
            # Use a strict 90-second timeout at the system socket layer
            with urllib.request.urlopen(req, timeout=90.0) as response_stream:
                return response_stream.read()

        # Run the system socket call safely inside an isolated worker thread
        loop = asyncio.get_running_loop()
        try:
            image_bytes = await loop.run_in_executor(None, perform_native_fetch)
        except urllib.error.HTTPError as http_err:
            # Handle the Hugging Face 503 Model Wake-up state gracefully
            if http_err.code == 503:
                error_response = json.loads(http_err.read().decode("utf-8"))
                estimated_time = error_response.get("estimated_time", 20)
                print(f"Model is wake-loading on Hugging Face. Waiting {estimated_time} seconds dynamically...")
                await asyncio.sleep(estimated_time)
                # Retry once after sleep window
                image_bytes = await loop.run_in_executor(None, perform_native_fetch)
            else:
                raise http_err

        if not image_bytes:
            raise RuntimeError("No image byte payload structure was returned from Hugging Face.")
            
        with open(output_path, "wb") as f:
            f.write(image_bytes)
        print(f"Hugging Face caricature generation complete for {name}. Saved to {output_path}")
        
        try:
            frontend_pub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "public")
            if os.path.exists(frontend_pub_dir):
                shutil.copyfile(output_path, os.path.join(frontend_pub_dir, f"caricature_{emp_id}.png"))
        except Exception as sync_err:
            print(f"Warning: Failed to sync image to frontend directory: {sync_err}")
            
        return f"/static/{output_filename}"
        
    except Exception as e:
        raise RuntimeError(f"Image generation failed via Hugging Face: {str(e)}")


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
                try:
                    # FIXED: Added `await` here because generate_caricature_card_helper is now async!
                    caricature_url = await generate_caricature_card_helper(row)
                    caricature_name = f"caricature_{emp_id}.png"
                except Exception as e:
                    print(f"Error generating dynamic caricature card: {e}")
                
                new_timeline = [
                    {"time": "Just Now", "event": event_name, "status": "completed" if caricature_url else "failed"},
                    *timeline
                ]
                cursor.execute("""
                    UPDATE employees
                    SET progress = 100, status = ?, caricature_url = ?, caricature_name = ?, timeline = ?
                    WHERE id = ?
                """, ("Ready for Review" if caricature_url else "Generation Failed", caricature_url, caricature_name, json.dumps(new_timeline), emp_id))
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
    
    # Spawn background task directly using asyncio.create_task and track it
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)