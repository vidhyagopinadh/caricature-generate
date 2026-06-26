import os
import json
from datetime import datetime

# Path to the IDE's local brain directory
APP_DATA_DIR = r"C:\Users\Vidhya G Nadh\.gemini\antigravity-ide\brain"
OUTPUT_FILE = "all_conversation_prompts_updated.md"

def extract_prompts():
    if not os.path.exists(APP_DATA_DIR):
        print(f"Error: Could not locate AppData directory at: {APP_DATA_DIR}")
        return

    sessions_data = []

    # Iterate through all conversation folders
    for conv_id in os.listdir(APP_DATA_DIR):
        conv_dir = os.path.join(APP_DATA_DIR, conv_id)
        if not os.path.isdir(conv_dir):
            continue
        
        # Check for both full and truncated transcripts
        transcript_path = os.path.join(conv_dir, ".system_generated", "logs", "transcript.jsonl")
        if not os.path.exists(transcript_path):
            continue
            
        print(f"Reading session logs for ID: {conv_id}...")
        session_prompts = []
        
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        step = json.loads(line)
                        # Filter for user inputs
                        if step.get("type") == "USER_INPUT":
                            prompt_text = step.get("content", "")
                            # Format time nicely if present
                            timestamp = step.get("timestamp", "Unknown Time")
                            session_prompts.append({
                                "time": timestamp,
                                "prompt": prompt_text
                            })
                    except Exception:
                        continue
        except Exception as e:
            print(f"  Error reading session {conv_id}: {e}")
            
        if session_prompts:
            sessions_data.append({
                "session_id": conv_id,
                "prompts": session_prompts
            })

    # Write prompts history to Markdown file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("# Complete Project Conversation Prompt History\n\n")
        out.write("This document compiles the chronological history of all user request prompts from all sessions of this project, parsed directly from the local IDE logs.\n\n")
        
        for i, session in enumerate(sessions_data, 1):
            out.write(f"## Session {i} (ID: {session['session_id']})\n\n")
            for j, req in enumerate(session["prompts"], 1):
                out.write(f"### Request {j} (Time: {req['time']})\n")
                out.write("```text\n")
                out.write(f"{req['prompt'].strip()}\n")
                out.write("```\n\n")
                
    print(f"\nSuccess! Extracted prompt logs and saved them to {OUTPUT_FILE}")

if __name__ == "__main__":
    extract_prompts()
