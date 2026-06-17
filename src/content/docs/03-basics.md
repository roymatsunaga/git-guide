---
title: 3. Basic Workflow
---

Start using Git with these everyday commands.

## Quick Start

```bash
# Create a new repository
git init

# Clone an existing repository
git clone https://github.com/username/repo.git

# Check the status of your changes
git status

# Stage changes for commit
git add filename.txt
git add .                    # Stage all changes

# Commit staged changes
git commit -m "Describe what changed and why"

# Send commits to remote
git push

# Fetch and merge changes from remote
git pull
```

## Creating Your First Repository

### Option 1: Start Locally

Create a new folder and initialize a Git repo:

```bash
mkdir my-project
cd my-project
git init
```

This creates a hidden `.git` folder that tracks everything. You're now ready to add files and make commits.

### Option 2: Clone an Existing Repository

Copy an existing repo from a server (e.g., GitHub):

```bash
git clone https://github.com/username/my-project.git
cd my-project
```

This downloads the entire project history and sets up a remote called `origin` pointing back to the original repo.

## The Daily Workflow

### 1. Check What's Changed

```bash
git status
```

Output might look like:
```
On branch main
Changes not staged for commit:
  modified:   README.md
  modified:   src/app.js

Untracked files:
  new_feature.txt
```

- **Modified** — Changed files Git already knows about
- **Untracked** — New files Git hasn't seen before

### 2. Stage Your Changes

```bash
# Add a specific file
git add README.md

# Add all changes
git add .

# Stage only parts of a file (interactive)
git add -p filename.txt
```

Check what you've staged:
```bash
git status
```

### 3. Commit

A good commit message is crucial. It should explain **why** the change was made, not what changed (the code already shows that).

```bash
git commit -m "Fix login bug where sessions expire immediately"
```

Or for a longer message:
```bash
git commit
```

This opens your editor. Write a summary on the first line, then a blank line, then more details.

Example:
```
Fix login bug where sessions expire immediately

Users were unable to stay logged in for more than a few minutes
because the session timeout was set to 1 second instead of 1 hour.
This affected both web and mobile clients.

Fixes: #1234
```

### 4. Review Your Commits

See the commits you've made:

```bash
# Recent commits
git log

# More detailed view
git log --oneline

# With author and time
git log --pretty=format:"%h - %an, %ar : %s"
```

### 5. Push to Remote

Once you're happy with your commits, send them to the server:

```bash
git push
```

This sends your commits from the `main` branch to the `origin` remote.

First time pushing a new branch? Use:
```bash
git push --set-upstream origin branch-name
```

Or the shorter version:
```bash
git push -u origin branch-name
```

## Getting Updates from Others

### Pull (Most Common)

```bash
git pull
```

This fetches changes from the remote and merges them into your current branch. It's the combination of two commands:
```bash
git fetch        # Download changes
git merge        # Merge them into your branch
```

For most everyday work, `git pull` is what you want.

### Fetch (Advanced)

If you want to see what changed before merging:

```bash
git fetch
git log origin/main    # See what's on the remote
git merge              # Merge if it looks good
```

## Common Situations

### I Made Changes and Want to Undo Them

If you haven't committed yet:
```bash
git restore filename.txt        # Undo changes to one file
git restore .                   # Undo all changes
```

### I Committed Something Wrong

If it's your most recent commit and you haven't pushed yet:
```bash
git reset --soft HEAD~1    # Undo the commit but keep changes
git reset --hard HEAD~1    # Undo the commit and discard changes
```

More on fixing mistakes: [Fixing Mistakes](07-troubleshooting)

### I Forgot to Add a File to My Commit

If you haven't pushed yet:
```bash
git add forgotten-file.txt
git commit --amend --no-edit    # Add to the last commit
```

### I Want to Save My Work Temporarily

```bash
git stash                   # Save your changes
# ... do something else ...
git stash pop              # Restore your changes
```

## Tips

- **Commit often** — Small, focused commits are easier to review and debug
- **Write good messages** — Future you will thank present you
- **Pull before you push** — Avoid conflicts by staying up-to-date
- **Don't commit secrets** — No passwords, API keys, or credentials in your repo
- **Use branches** — Keep `main` stable and work on features in separate branches

## Next Steps

Ready to work with branches? Jump to [Branching & Merging](04-branching).
