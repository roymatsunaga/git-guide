---
title: 5. Advanced Features
---

Master Git with these powerful techniques.

## Rebase

Rebasing replays your commits on top of another branch, creating a linear history instead of merge commits.

**Visual learner?** Check [Visual Guide: Rebasing](../09-visual-guide/#rebasing) to see how commits are replayed.

### When to Use Rebase

- **To keep history clean** — Linear history is easier to read and debug
- **Before merging to main** — Rebase your feature branch on main to integrate changes
- **Never on shared branches** — Don't rebase branches that others depend on

### Basic Rebase

```bash
git switch feature/dark-mode
git rebase main
```

This replays each of your feature commits on top of the current main branch. If there are conflicts, Git pauses and asks you to resolve them before continuing.

### Interactive Rebase

Rewrite history by changing, combining, or reordering commits:

```bash
git rebase -i main
```

This opens an editor with a list of commits. Change `pick` to:
- `reword` — Change the commit message
- `squash` — Combine this commit with the previous one
- `drop` — Delete the commit
- `edit` — Stop and let you modify the commit

Example: Combine three small commits into one:
```
pick 1a2b3c Fix layout bug
squash 2b3c4d Add test
squash 3c4d5e Update docs

# Results in one commit: "Fix layout bug"
```

## Squashing

Squashing combines multiple commits into one. Useful before merging to keep the main branch clean.

### Squash During Merge

```bash
git switch main
git merge --squash feature/dark-mode
git commit -m "Add dark mode support"
```

This creates a single commit on main containing all the changes from the feature branch.

### Squash Using Rebase

```bash
git rebase -i main
```

Then change `pick` to `squash` for all commits except the first.

## Cherry-Pick

Apply a specific commit from one branch to another without merging the entire branch.

**Visual learner?** Check [Visual Guide: Cherry-Pick](../09-visual-guide/#cherry-pick) to see the commit graph.

```bash
git cherry-pick abc123def
```

This copies the commit with hash `abc123def` into your current branch.

### Useful For

- Backporting a bugfix to an older version
- Applying a specific change without unrelated changes
- Recovering a commit that was accidentally deleted

### Cherry-Pick Multiple Commits

```bash
git cherry-pick abc123def..def456abc
```

This cherry-picks all commits from `abc123def` to `def456abc`.

## Stash

Temporarily save work without committing it. Useful when you need to switch branches but aren't ready to commit.

### Save Changes

```bash
git stash                    # Save all changes
git stash save "wip: dark mode"   # With a description
```

### List Stashed Changes

```bash
git stash list
```

Output:
```
stash@{0}: wip: dark mode
stash@{1}: Fix typo in header
```

### Restore Stashed Changes

```bash
git stash pop               # Restore the most recent stash
git stash pop stash@{1}     # Restore a specific stash
```

### Delete a Stash

```bash
git stash drop stash@{0}
git stash clear             # Delete all stashes
```

## Amending Commits

Fix a commit after the fact (only before pushing to a shared branch).

### Change the Commit Message

```bash
git commit --amend --no-edit    # Keep the message
git commit --amend              # Change the message
```

### Add Forgotten Files

```bash
git add forgotten-file.txt
git commit --amend --no-edit
```

The file is added to the last commit.

### Change the Commit Content

```bash
git reset --soft HEAD~1         # Undo the commit, keep changes
git add new-changes.txt         # Add more files
git commit -m "Original message"
```

## Reset

Move HEAD to a different commit. Be careful: this can discard work.

### Soft Reset

```bash
git reset --soft HEAD~1
```

Undoes the last commit but keeps your changes staged. You can now recommit differently.

### Mixed Reset (Default)

```bash
git reset HEAD~1
```

Undoes the last commit and unstages changes. Your files are unchanged.

### Hard Reset

```bash
git reset --hard HEAD~1
```

**Danger!** This undoes the commit AND discards all changes. Only use this if you're sure.

### Reset to a Specific Commit

```bash
git reset --hard abc123def
```

Move HEAD to commit `abc123def` and discard everything after. Only use on local, unpushed commits.

## Reflog

Git keeps a log of every movement of HEAD. Use this to recover "lost" commits.

```bash
git reflog
```

Output:
```
abc123d HEAD@{0}: commit: Fix login bug
def456a HEAD@{1}: checkout: switching to feature-branch
```

Find a lost commit here and reset to it:
```bash
git reset --hard abc123d
```

## Tag

Mark important commits (e.g., releases) with a permanent label.

### Create a Tag

```bash
git tag v1.0.0              # Lightweight tag
git tag -a v1.0.0 -m "Release 1.0"  # Annotated tag (recommended)
```

### List Tags

```bash
git tag
git tag -l "v1*"            # Filter by pattern
```

### Push Tags

```bash
git push origin v1.0.0      # Push one tag
git push origin --tags      # Push all tags
```

## Viewing History

### See What Changed in a Commit

```bash
git show abc123def
```

Shows the commit message and the exact changes.

### Compare Branches

```bash
git diff main feature/dark-mode
```

Shows all differences between the two branches.

### Find Who Changed a Line

```bash
git blame styles.css
```

Shows the author and commit for each line.

### Search Commit Messages

```bash
git log --grep="fix login"
```

Finds all commits mentioning "fix login".

## Useful Git Tricks

### See Unpushed Commits

```bash
git log origin/main..HEAD
```

Shows commits you've made that aren't on the remote yet.

### See Unmerged Branches

```bash
git branch --no-merged
```

Branches that haven't been merged to the current branch.

### Create a Backup Before Risky Operations

```bash
git branch backup
# Now you can safely experiment, knowing backup exists
git reset --hard abc123def
git reflog  # If something goes wrong, you can recover
```

### Clean Up Local Branches

```bash
git branch --merged | grep -v main | xargs git branch -d
```

Deletes all merged branches except main.

## Common Mistakes

### I Rebased a Shared Branch

If you rebased a branch others are using, don't force-push. Instead, reset it:

```bash
git reset --hard origin/branch-name
```

Tell your team and they'll need to pull the reset.

### I Amended a Pushed Commit

Don't amend commits that others have pulled. If you must, warn your team they'll need to reset.

### I Cherry-Picked the Wrong Commit

Find the commit hash and reset:
```bash
git reset --hard HEAD~1
```

## Best Practices

- **Keep commits atomic** — One logical change per commit
- **Write clear messages** — Explain why, not what
- **Never force-push to shared branches** — It breaks teammate workflows
- **Test before pushing** — Run tests after rebase/cherry-pick
- **Use reflog as a safety net** — You can recover almost anything

## Next Steps

Ready to collaborate with your team? Jump to [Collaboration Patterns](../06-collaboration/).

Or dive into [Fixing Mistakes](../07-troubleshooting/) for disaster recovery.
