# Issue Workflow - Detailed Documentation

## 📖 Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Workflow Steps](#workflow-steps)
- [Conventions](#conventions)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Issue Workflow automation streamlines the entire GitHub development workflow:

```
Issue Creation → Feature Branch → Code Changes → Commit → Push → PR Creation → Issue Update
```

**Time Saved**: ~5-10 minutes per feature/bugfix

---

## Installation

### Prerequisites
1. **GitHub CLI** - Install from https://cli.github.com/
2. **Git** - Already installed in most development environments
3. **GitHub Authentication** - Run `gh auth login`

### Verification
```bash
# Check if gh is installed
gh --version

# Check authentication status
gh auth status

# Test issue creation (dry run)
gh issue list
```

---

## Usage Guide

### Method 1: Interactive Terminal (Recommended for Manual Work)
```bash
cd /path/to/habits-rpg
./scripts/issue-workflow.sh
```

Follow the interactive prompts:
1. Enter issue title
2. Enter description (optional)
3. Wait for branch creation
4. Make your code changes
5. Stage files
6. Enter commit message
7. Wait for PR creation

### Method 2: AI-Assisted (Recommended for AI Agents)
In OpenCode or similar AI coding assistants:

```
"Run the issue workflow for adding dark mode"
"Use issue-workflow to create a PR for bug fix"
```

The AI will programmatically execute each step.

---

## Workflow Steps

### Step 1: Issue Creation
- Prompts for title and description
- Creates issue via `gh issue create`
- Extracts issue number from URL
- **Output**: Issue #N created

### Step 2: Branch Creation
- Generates branch name: `issue-{N}-{title-slug}`
- Slugifies title (lowercase, hyphens, alphanumeric)
- Checks out new branch
- **Output**: Branch `issue-22-exp-display-improvement`

### Step 3: Code Changes
- Pauses for user to make changes
- No automatic code modification
- **Action Required**: Edit files manually

### Step 4: Staging & Commit
- Shows `git status`
- Optionally stages all files (`git add .`)
- Prompts for commit message
- Auto-formats: `{message} (#{issue_number})`
- **Output**: Commit created with proper format

### Step 5: Push to Remote
- Pushes branch: `git push -u origin {branch_name}`
- Sets up tracking
- **Output**: Branch available on GitHub

### Step 6: PR Creation
- Creates PR with default template
- Auto-links to issue: `Closes #{issue_number}`
- **Output**: PR #M created

### Step 7: Issue Update
- Comments on issue with PR link
- **Output**: Issue updated with PR reference

---

## Conventions

### Branch Naming
```
issue-{number}-{title-slug}
```

**Examples:**
- `issue-22-exp-display-improvement`
- `issue-23-fix-login-redirect`
- `issue-24-add-dark-mode`

### Commit Messages
```
{type}: {description} (#{issue_number})
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

**Examples:**
- `feat: EXP表示にストリークボーナスの内訳を追加 (#22)`
- `fix: login redirect loop (#23)`
- `docs: update API documentation (#24)`

### PR Body Template
```markdown
## Summary
Implements #{issue_number}

### Changes
- Added X feature
- Fixed Y bug
- Improved Z performance

### Testing
- Manual testing completed
- All tests passing
- Verified on staging

Closes #{issue_number}
```

---

## Examples

### Example 1: Feature Implementation
```bash
$ ./scripts/issue-workflow.sh

Issue title: Add user profile avatars
Issue description: Allow users to upload custom avatars

✅ Issue created: #25
✅ Branch created: issue-25-add-user-profile-avatars

# [Make code changes]

Commit message: feat: implement avatar upload functionality
✅ Committed: feat: implement avatar upload functionality (#25)
✅ Branch pushed
✅ PR created: #26
✅ Issue updated
```

### Example 2: Bug Fix
```bash
$ ./scripts/issue-workflow.sh

Issue title: Fix calendar date picker crash
Issue description: Calendar crashes when selecting past dates

✅ Issue created: #27
✅ Branch created: issue-27-fix-calendar-date-picker-crash

# [Fix the bug]

Commit message: fix: prevent crash on past date selection
✅ Committed: fix: prevent crash on past date selection (#27)
✅ Branch pushed
✅ PR created: #28
✅ Issue updated
```

### Example 3: Multi-Commit Workflow
If you need multiple commits:

```bash
# Run workflow
$ ./scripts/issue-workflow.sh
# ... creates issue #29, branch issue-29-refactor-auth

# Make first set of changes
$ git add src/auth/
$ git commit -m "refactor: extract auth service (#29)"

# Make second set of changes
$ git add tests/auth/
$ git commit -m "test: add auth service tests (#29)"

# Push all commits
$ git push

# Create PR manually
$ gh pr create --base main --title "Refactor authentication service" --body "Closes #29"
```

---

## Troubleshooting

### "gh: command not found"
**Problem**: GitHub CLI not installed

**Solution**:
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

### "Not authenticated with GitHub CLI"
**Problem**: Not logged in to GitHub

**Solution**:
```bash
gh auth login
# Follow interactive prompts
```

### "Permission denied: ./scripts/issue-workflow.sh"
**Problem**: Script not executable

**Solution**:
```bash
chmod +x scripts/issue-workflow.sh
```

### "Failed to create issue"
**Problem**: Network issues or repository permissions

**Solution**:
1. Check internet connection
2. Verify repository access: `gh repo view`
3. Check rate limits: `gh api rate_limit`

### "Branch already exists"
**Problem**: Branch name collision

**Solution**:
```bash
# Delete local branch
git branch -D issue-N-description

# Delete remote branch
git push origin --delete issue-N-description

# Re-run workflow
./scripts/issue-workflow.sh
```

### "Nothing to commit"
**Problem**: No changes staged

**Solution**:
1. Make code changes first
2. Use `git add` to stage files
3. Continue workflow

---

## Advanced Usage

### Custom Branch Names
Modify `scripts/issue-workflow.sh` line 44:
```bash
# Original
branch_name="issue-${issue_number}-${branch_slug}"

# Custom format
branch_name="feature/${issue_number}-${branch_slug}"
```

### Skip Steps
Comment out unwanted steps in the script:
```bash
# Skip automatic push
# git push -u origin "$branch_name"
```

### Integration with CI/CD
The workflow works seamlessly with GitHub Actions:
1. PR creation triggers CI checks
2. Issue auto-closes on PR merge
3. Branch auto-deletes (if configured)

---

## Best Practices

1. **One Issue, One PR**: Don't mix multiple features
2. **Descriptive Titles**: Use clear, concise issue titles
3. **Link Issues**: Always use `Closes #N` in PR body
4. **Test First**: Verify changes work before creating PR
5. **Clean Commits**: Use meaningful commit messages
6. **Review Ready**: Ensure code is review-ready before PR creation

---

## See Also
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Git Branching Best Practices](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [AGENTS.md](../AGENTS.md) - Project development guidelines

---

**Created**: 2026-01-31  
**Last Updated**: 2026-01-31  
**Version**: 1.0.0
