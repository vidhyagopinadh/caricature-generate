import asyncio
import os
import sqlite3
import json
from google import genai
from google.genai import types

# Import load_gemini_api_key and generate_caricature_card_helper from app.main
import sys
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), "app"))
from main import generate_caricature_card_helper, get_db_connection

async def run_test():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = '4'")
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        print("Employee 4 not found in database!")
        return
        
    print(f"Running generation helper directly for: {row['name']}")
    try:
        url = await generate_caricature_card_helper(row)
        print(f"SUCCESS! Output URL: {url}")
    except Exception as e:
        print("PIPELINE FAILED!")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_test())
