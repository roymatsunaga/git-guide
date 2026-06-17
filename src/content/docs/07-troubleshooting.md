---
title: 7. Fixing Mistakes
---

Recover from Git errors. The good news: almost nothing is permanent in Git.

## I Made Changes I Don't Want

### Haven't Staged Yet

```bash
git restore filename.txt        # Discard changes to one file
git restore .                   # Discard all changes
```

Or the older syntax:
```bash
git checkout -- filename.txt
```

### Already Staged (But Not Committed)

```bash
git restore --staged filename.txt   # Unstage the file
git restore filename.txt            # Also discard the changes
```

Or:
```bash
git reset filename.txt              # Unstage
git restore filename.txt            # Discard
```

### Already Committed (But Not Pushed)

```bash
git reset --soft HEAD~1         # Undo commit, keep changes staged
git reset --mixed HEAD~1        # Undo commit, keep changes unstaged
git reset --hard HEAD~1         # Undo commit, discard changes (dangerous!)
```

For older commits:
```bash
git reset --hard abc123def      # Go back to that commit, discard everything after
```

## I Committed to the Wrong Branch

You committed to `main` but meant to commit to `feature/dark-mode`.

```bash
# Get the commit hash
git log

# Reset main to before your commit
git reset --soft HEAD~1

# Switch to the correct branch
git switch feature/dark-mode

# Create the commit there
git add .
git commit -m "Your commit message"

# Go back to main and verify it's clean
git switch main
git status  # Should be clean
```

## I Need to Undo My Last Commit Message

```bash
git commit --amend              # Opens editor to change message
```

Or change message and keep everything:
```bash
git commit --amend -m "New message"
```

**Only do this before pushing.** After pushing, it creates problems for teammates.

## I Accidentally Deleted a Branch

Git keeps a log of everything. Recover with reflog:

```bash
git reflog
```

Find the branch's last commit:
```
abc123d HEAD@{0}: commit: Feature complete
def456a HEAD@{1}: checkout: switching to feature
```

Recreate the branch:
```bash
git switch -c feature/dark-mode abc123d
```

## I Pushed Something I Shouldn't Have

### If No One Else Has Pulled Yet

```bash
git reset --hard HEAD~1         # Undo locally
git push --force-with-lease     # Overwrite remote
```

**Warn your team first.** Then tell them to pull the reset.

### If Others Have Already Pulled

Use `git revert` instead of reset (creates a new commit that undoes the change):

```bash
git revert HEAD                 # Undo the last commit
git push
```

Now everyone pulls the revert commit.

## I Lost a Commit

Git keeps a log of HEAD movements. Find it:

```bash
git reflog
```

Example output:
```
abc123d HEAD@{0}: reset: moving to HEAD~1
def456a HEAD@{1}: commit: Important feature
```

Recover the commit:
```bash
git reset --hard def456a
```

Or create a new branch from it:
```bash
git switch -c recovery def456a
```

## I Have a Merge Conflict

See [Branching & Merging](../04-branching/) for detailed resolution.

Quick version:
1. Open conflicted files
2. Resolve conflicts (remove `<<<<`, `====`, `>>>>`)
3. Stage the files: `git add .`
4. Continue: `git commit` or `git rebase --continue` (depending on what you were doing)

### Abort the Merge/Rebase

If it's too messy:
```bash
git merge --abort
git rebase --abort
```

Try again later.

## My Repo Seems Corrupted

Try to check the repo's integrity:

```bash
git fsck --full
```

If it finds issues, you can usually recover from backups or remote copies.

If you have a remote copy:
```bash
git fetch origin
git reset --hard origin/main
```

## I Accidentally Rebased the Wrong Branch

If you rebased a shared branch and pushed it:

1. Don't panic — you can fix this
2. Tell your team
3. Reset the branch: `git reset --hard origin/branch-name`
4. Tell everyone to pull the reset

If you rebased locally but haven't pushed:
```bash
git reset --hard origin/main    # Go back to remote state
git reflog                      # Find where you were before
git reset --hard abc123d        # Go back to that state
```

## Common "I Messed Up" Commands

| Situation | Command |
|-----------|---------|
| Discard changes to a file | `git restore filename.txt` |
| Undo the last commit | `git reset --soft HEAD~1` |
| Undo and discard changes | `git reset --hard HEAD~1` |
| See what you did | `git reflog` |
| Recover a lost commit | `git reset --hard <commit>` |
| Fix a commit message | `git commit --amend` |
| Undo a pushed commit | `git revert <commit>` |
| Abort a merge | `git merge --abort` |
| Abort a rebase | `git rebase --abort` |

## The Nuclear Option

If everything is a mess, you can clone the remote repo fresh:

```bash
cd ..
rm -rf messed-up-repo
git clone <url> messed-up-repo
cd messed-up-repo
```

This is extreme but sometimes necessary.

## What You Can't Undo

Almost nothing is permanent in Git, but here are the rare cases:

- **Garbage collected commits** — If a commit isn't referenced anywhere and hasn't been pushed, it might be garbage collected after ~30 days. Keep backups of important work.
- **Force-pushed to a remote where someone else started new work** — If you force-push and someone else pulled the old state, they have work on the old state. This is messy but recoverable.

## Prevention

Avoid these mistakes by:

- **Commit frequently** — More checkpoints mean less lost work
- **Use feature branches** — Never work directly on main
- **Pull before you push** — Avoid conflicts
- **Test before pushing** — Don't push broken code
- **Read git status** — Know what you're committing
- **Use `--force-with-lease`** — Safer than `--force`

## Get Help

If you're stuck:

```bash
git status              # Current state
git log --oneline       # Recent commits
git reflog              # Everything you've done
```

And remember: almost nothing is permanent. Take a breath and work through it.

## Next Steps

Check out [Command Reference](../08-reference/) for a full command lookup.

Or go back to [Advanced Features](../05-advanced/) to learn techniques for preventing mistakes.
