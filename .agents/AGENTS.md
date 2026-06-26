# Workspace Customizations & Agent Rules

This workspace uses automated prompts tracking rules.

## Prompt Syncing Rules
- **Automatic Sync**: Before completing any task or ending your turn, you MUST run `python extract_all_prompts.py` to compile the latest conversation prompts for this project.
- **Git Commit Sync**: Ensure that `all_conversation_prompts_updated.md` is updated and staged when committing code changes.
