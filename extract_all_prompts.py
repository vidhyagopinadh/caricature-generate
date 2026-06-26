import os
import json

# Path to the IDE's local brain directory
APP_DATA_DIR = r"C:\Users\Vidhya G Nadh\.gemini\antigravity-ide\brain"
OUTPUT_FILE = "all_conversation_prompts_updated.md"

def extract_prompts():
    if not os.path.exists(APP_DATA_DIR):
        print(f"Error: Could not locate AppData directory at: {APP_DATA_DIR}")
        return

    # Get current working directory to filter only prompts for this project
    current_project_dir = os.getcwd().lower()
    project_folder_name = os.path.basename(os.getcwd())
    print(f"Filtering prompts for project directory: '{current_project_dir}' ({project_folder_name})...")

    sessions_data = []

    # Iterate through all conversation folders
    for conv_id in os.listdir(APP_DATA_DIR):
        conv_dir = os.path.join(APP_DATA_DIR, conv_id)
        if not os.path.isdir(conv_dir):
            continue
        
        transcript_path = os.path.join(conv_dir, ".system_generated", "logs", "transcript.jsonl")
        if not os.path.exists(transcript_path):
            continue
            
        session_prompts = []
        is_current_project = False
        
        try:
            with open(transcript_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                for line in lines:
                    # Check if this log references the current project's workspace folder
                    if current_project_dir in line.lower() or project_folder_name.lower() in line.lower():
                        is_current_project = True
                        
                    try:
                        step = json.loads(line)
                        if step.get("type") == "USER_INPUT":
                            prompt_text = step.get("content", "")
                            timestamp = step.get("timestamp", "Unknown Time")
                            session_prompts.append({
                                "time": timestamp,
                                "prompt": prompt_text
                            })
                    except Exception:
                        continue
        except Exception as e:
            print(f"  Error reading session {conv_id}: {e}")
            
        if is_current_project and session_prompts:
            sessions_data.append({
                "session_id": conv_id,
                "prompts": session_prompts
            })

    if not sessions_data:
        print("No prompts found matching this project.")
        return

    # Write prompts history to Markdown file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"# Complete Project Conversation Prompt History - {project_folder_name}\n\n")
        out.write(f"This document compiles the chronological history of all user request prompts from all sessions of the **{project_folder_name}** project workspace.\n\n")
        
        for i, session in enumerate(sessions_data, 1):
            out.write(f"## Session {i} (ID: {session['session_id']})\n\n")
            for j, req in enumerate(session["prompts"], 1):
                out.write(f"### Request {j} (Time: {req['time']})\n")
                out.write("```text\n")
                out.write(f"{req['prompt'].strip()}\n")
                out.write("```\n\n")
                
    print(f"\nSuccess! Extracted {len(sessions_data)} sessions for this project. Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    extract_prompts()
