---
name: save-prompts
description: Automatically extracts chronological conversation prompts matching the current project workspace.
---

# Save Prompts Skill

Use this skill to parse, compile, and record all user prompt instructions for this project.

## Implementation Steps
1. Execute `python extract_all_prompts.py` in the workspace root directory.
2. Confirm the prompt compilation updates `all_conversation_prompts_updated.md` successfully.
3. Stage and commit the changes to version control to keep the repository log updated.
