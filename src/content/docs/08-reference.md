---
title: 8. Command Reference
---

Quick lookup for common Git commands.

## Setup & Configuration

```bash
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
git config --global --list              # View all settings
```

## Creating & Cloning

```bash
git init                        # Initialize a new repo
git clone <url>                 # Clone an existing repo
git clone <url> folder-name     # Clone into a specific folder
```

## Checking Status

```bash
git status                      # Current state
git status -s                   # Short format
git log                         # Commit history
git log --oneline               # Condensed history
git log -p                      # Show changes in each commit
git log --graph --oneline --all # Visual branch history
git diff                        # Unstaged changes
git diff --staged               # Staged changes
git show <commit>               # Show a specific commit
git blame <file>                # Who changed each line
```

## Making Changes

```bash
git add <file>                  # Stage a file
git add .                       # Stage all changes
git add -p                      # Interactive staging
git commit -m "message"         # Commit with message
git commit                      # Commit, open editor for message
git commit --amend              # Modify the last commit
git commit --amend --no-edit    # Add to last commit, keep message
git restore <file>              # Discard changes to a file
git restore .                   # Discard all changes
git restore --staged <file>     # Unstage a file
```

## Branching

```bash
git branch                      # List local branches
git branch -a                   # List all branches (local + remote)
git branch <name>               # Create a branch
git branch -d <name>            # Delete a branch
git switch <branch>             # Switch to a branch
git switch -c <branch>          # Create and switch to a branch
git checkout <branch>           # Old syntax for switching
git checkout -b <branch>        # Old syntax for create + switch
```

## Merging

```bash
git merge <branch>              # Merge a branch into current
git merge --no-ff <branch>      # Merge with merge commit
git merge --squash <branch>     # Squash commits before merge
git merge --abort               # Cancel a merge in progress
```

## Rebasing

```bash
git rebase <branch>             # Rebase current branch onto another
git rebase -i <branch>          # Interactive rebase
git rebase --continue           # Continue after resolving conflicts
git rebase --abort              # Cancel a rebase
```

## Remote Operations

```bash
git remote                      # List remotes
git remote -v                   # Show remote URLs
git remote add origin <url>     # Add a remote
git fetch                       # Download from remote
git fetch <remote>              # Fetch from specific remote
git pull                        # Fetch and merge from remote
git push                        # Push to remote
git push -u origin <branch>     # Push and set upstream
git push <remote> <branch>      # Push to specific remote
git push --force-with-lease     # Force push (safer)
git push origin --delete <branch>  # Delete remote branch
git push --tags                 # Push all tags
```

## Undoing Changes

```bash
git restore <file>              # Discard unstaged changes
git restore --staged <file>     # Unstage
git reset HEAD~1                # Undo last commit (mixed)
git reset --soft HEAD~1         # Undo, keep changes staged
git reset --hard HEAD~1         # Undo, discard changes
git reset --hard <commit>       # Go back to a specific commit
git revert <commit>             # Undo a commit (creates new commit)
git checkout -- <file>          # Old syntax for discard
```

## Cherry-Pick & Stash

```bash
git cherry-pick <commit>        # Apply a specific commit
git cherry-pick <commit1>..<commit2>  # Multiple commits
git cherry-pick --abort         # Cancel cherry-pick
git stash                       # Save changes temporarily
git stash save "message"        # Stash with description
git stash list                  # List stashes
git stash pop                   # Restore most recent stash
git stash pop stash@{0}         # Restore specific stash
git stash drop stash@{0}        # Delete a stash
git stash clear                 # Delete all stashes
```

## Tags

```bash
git tag                         # List tags
git tag <name>                  # Create lightweight tag
git tag -a <name> -m "message"  # Create annotated tag
git show <tag>                  # Show tag details
git push origin <tag>           # Push one tag
git push origin --tags          # Push all tags
git tag -d <name>               # Delete local tag
git push origin --delete <tag>  # Delete remote tag
```

## Inspecting Changes

```bash
git diff                        # Show unstaged changes
git diff <branch1> <branch2>    # Compare two branches
git diff <commit1> <commit2>    # Compare two commits
git log --grep="text"           # Search commit messages
git log -S "code"               # Search for code changes
git log --since="2 weeks ago"   # Commits in last 2 weeks
git log <file>                  # History of a file
git blame <file>                # Show who changed each line
```

## Cleaning Up

```bash
git clean -fd                   # Remove untracked files and dirs
git gc                          # Clean up and optimize repo
git reflog                      # Show all HEAD movements
git fsck --full                 # Check repo integrity
```

## Advanced

```bash
git rebase -i HEAD~3            # Rebase last 3 commits
git squash <commit>             # Interactive rebase (see 05-advanced.md)
git bisect start                # Start binary search for bad commit
git filter-branch               # Rewrite history (advanced)
git worktree add <path>         # Create multiple working directories
```

## Useful Aliases

Add these to your Git config for faster commands:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'restore --staged'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
```

Then use:
```bash
git st              # instead of git status
git co main         # instead of git checkout main
```

## Getting Help

```bash
git help <command>              # Opens man page
git <command> --help            # Quick help
git                             # List basic commands
git config --help               # Help for config
```

## Command Cheat Sheet by Task

### "I want to see what changed"
```bash
git status              # Current state
git diff                # What I changed
git log --oneline       # Commit history
git show <commit>       # Details of a commit
```

### "I want to save my work"
```bash
git add .               # Stage everything
git commit -m "msg"     # Commit
git push                # Push to remote
```

### "I want to update from remote"
```bash
git fetch               # See what's new
git pull                # Fetch and merge
```

### "I messed up"
```bash
git status              # See the mess
git reflog              # Find where you were
git reset --hard <commit>  # Go back
```

### "I want to work on something new"
```bash
git switch -c feature/name      # Create branch
git push -u origin feature/name # Push it
```

### "I want to merge my changes"
```bash
git switch main         # Go to main
git merge feature/name  # Merge the branch
git push                # Push to remote
```

## Exit Git Commands

Some commands open an editor or pager. Exit with:
- **Vim/Vi** — `:q` then Enter
- **Nano** — Ctrl+X
- **Less pager** — `q`

## Glossary

- **Repository** — A Git project folder
- **Commit** — A snapshot of changes
- **Branch** — A line of development
- **Remote** — A server copy (GitHub, etc.)
- **Staging** — Preparing changes for commit
- **HEAD** — Current commit you're on
- **Index** — Staging area
- **Merge** — Combine branches
- **Rebase** — Replay commits on a new base
- **Cherry-pick** — Apply specific commit
- **Stash** — Temporarily save changes
- **Tag** — Mark important commits
- **Reflog** — History of HEAD movements

---

For detailed explanations, see the other guides:
- [Concepts](01-concepts) — What is Git?
- [Basics](03-basics) — Day-to-day commands
- [Branching](04-branching) — Working with branches
- [Advanced](05-advanced) — Power user features
- [Collaboration](06-collaboration) — Team workflows
- [Troubleshooting](07-troubleshooting) — Fixing mistakes
