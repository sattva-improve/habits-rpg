#!/bin/bash
set -e

echo "🚀 GitHub Issue Workflow Automation"
echo "===================================="
echo ""

if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Please install it: https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

echo "📝 Step 1: Create GitHub Issue"
echo "------------------------------"
read -p "Issue title: " issue_title

if [ -z "$issue_title" ]; then
    echo "❌ Error: Issue title cannot be empty"
    exit 1
fi

read -p "Issue description (press Enter for editor): " issue_description

if [ -z "$issue_description" ]; then
    issue_url=$(gh issue create --title "$issue_title" --body "")
else
    issue_url=$(gh issue create --title "$issue_title" --body "$issue_description")
fi

if [ -z "$issue_url" ]; then
    echo "❌ Failed to create issue"
    exit 1
fi

issue_number=$(echo "$issue_url" | grep -oP '\d+$')
echo "✅ Issue created: #$issue_number"
echo "   URL: $issue_url"
echo ""

echo "🌿 Step 2: Create Feature Branch"
echo "---------------------------------"

branch_slug=$(echo "$issue_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
branch_name="issue-${issue_number}-${branch_slug}"

git checkout -b "$branch_name"
echo "✅ Branch created and checked out: $branch_name"
echo ""

echo "💻 Step 3: Work on Your Changes"
echo "--------------------------------"
echo "Make your code changes now."
echo "Press Enter when you're ready to commit..."
read -p ""

echo "📦 Step 4: Stage and Commit Changes"
echo "------------------------------------"

git status

read -p "Stage all changes? (y/n): " stage_all
if [ "$stage_all" = "y" ] || [ "$stage_all" = "Y" ]; then
    git add .
else
    echo "Please stage your changes manually with: git add <file>"
    read -p "Press Enter when staging is complete..."
fi

read -p "Commit message (auto-prefix with issue number): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="feat: $issue_title"
fi

git commit -m "$commit_message (#$issue_number)"
echo "✅ Changes committed"
echo ""

echo "📤 Step 5: Push to Remote"
echo "-------------------------"
git push -u origin "$branch_name"
echo "✅ Branch pushed to remote"
echo ""

echo "🔀 Step 6: Create Pull Request"
echo "-------------------------------"

default_pr_body="## Summary

Implements #${issue_number}

### Changes
- 

### Testing
- 

Closes #${issue_number}"

read -p "Use default PR body? (y/n): " use_default
if [ "$use_default" = "y" ] || [ "$use_default" = "Y" ]; then
    pr_url=$(gh pr create --base main --title "$issue_title" --body "$default_pr_body")
else
    pr_url=$(gh pr create --base main --title "$issue_title" --body "")
fi

if [ -z "$pr_url" ]; then
    echo "❌ Failed to create pull request"
    exit 1
fi

pr_number=$(echo "$pr_url" | grep -oP '\d+$')
echo "✅ Pull request created: #$pr_number"
echo "   URL: $pr_url"
echo ""

echo "📝 Step 7: Update Issue with PR Link"
echo "-------------------------------------"
gh issue comment "$issue_number" --body "✅ Pull request created: $pr_url"
echo "✅ Issue updated with PR link"
echo ""

echo "🎉 Workflow Complete!"
echo "====================="
echo "Issue: #$issue_number"
echo "Branch: $branch_name"
echo "PR: #$pr_number"
echo ""
echo "Next steps:"
echo "1. Wait for CI/CD checks to pass"
echo "2. Request review if needed"
echo "3. Merge PR when ready"
echo ""
