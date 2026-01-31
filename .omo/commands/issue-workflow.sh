#!/bin/bash

cat << 'EOF'
# 📚 Issue Workflow Command - Help

## Overview
Automates the full GitHub issue workflow: Issue creation → Branch → Commit → PR → Issue update

## Usage

### Interactive Mode (Recommended)
Run the script directly in your terminal:
```bash
./scripts/issue-workflow.sh
```

The script will guide you through:
1. Creating a GitHub Issue
2. Creating a feature branch (format: `issue-{number}-{title-slug}`)
3. Making your code changes
4. Committing with proper message format
5. Pushing to remote
6. Creating a Pull Request
7. Updating the issue with PR link

### AI-Assisted Mode
Ask the AI to handle the workflow:
```
"Run the issue workflow for [feature description]"
"Create an issue and PR for [bug fix description]"
```

## Requirements
- GitHub CLI (`gh`) installed and authenticated
- Git repository with remote configured
- Proper permissions to create issues and PRs

## Branch Naming Convention
- Format: `issue-{number}-{title-slug}`
- Example: `issue-22-exp-display-improvement`

## Commit Message Convention
- Auto-prefixed with issue number
- Format: `{message} (#{issue_number})`
- Example: `feat: add streak bonus display (#22)`

## PR Body Template
```markdown
## Summary
Implements #{issue_number}

### Changes
- 

### Testing
- 

Closes #{issue_number}
```

## Examples

### Feature Implementation
```bash
./scripts/issue-workflow.sh
# Follow prompts:
# Title: "Add dark mode support"
# Description: "Implement dark mode toggle in settings"
```

### Bug Fix
```bash
./scripts/issue-workflow.sh
# Follow prompts:
# Title: "Fix login redirect loop"
# Description: "Resolves infinite redirect when session expires"
```

## Tips
- Have your changes ready before running the script
- Use clear, descriptive issue titles
- The PR automatically links to the issue via "Closes #N"
- CI/CD checks will run automatically after PR creation

## Troubleshooting

### "gh: command not found"
Install GitHub CLI: https://cli.github.com/

### "Not authenticated with GitHub CLI"
Run: `gh auth login`

### "Failed to create issue"
Check your repository permissions and network connection

## Manual Alternative
If you prefer manual workflow:
1. `gh issue create --title "..." --body "..."`
2. `git checkout -b issue-N-description`
3. Make changes and commit
4. `git push -u origin issue-N-description`
5. `gh pr create --base main --title "..." --body "..."`

---

For more details, see: scripts/issue-workflow.sh
EOF
