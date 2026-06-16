# 4. Branching & Merging

Work on multiple features in parallel without stepping on each other's toes.

## Quick Start

```bash
# Create and switch to a new branch
git switch -c feature/dark-mode

# Make changes and commit
git add .
git commit -m "Add dark mode styles"

# Push the branch to remote
git push -u origin feature/dark-mode

# Switch back to main
git switch main

# Merge the feature branch in
git merge feature/dark-mode
```

## Why Branches?

Without branches, everyone works on the same copy of the code. This creates chaos:
- Person A is working on a login feature
- Person B is working on a search feature
- Their changes conflict everywhere

Branches let each person work in isolation, then merge changes back together.

## Creating and Switching Branches

### Create a Branch

```bash
git switch -c feature/dark-mode
```

This creates a new branch called `feature/dark-mode` and switches to it.

Old syntax (still works):
```bash
git checkout -b feature/dark-mode
```

### List Branches

```bash
# Local branches
git branch

# All branches (local + remote)
git branch -a
```

### Switch Between Branches

```bash
git switch feature/dark-mode    # Switch to the feature branch
git switch main                 # Switch back to main
```

## Naming Conventions

While Git doesn't enforce this, teams usually follow a pattern:

```
feature/                 — New feature
  feature/dark-mode
  feature/user-profiles

bugfix/ or fix/          — Bug fix
  fix/login-timeout
  fix/crash-on-startup

docs/                    — Documentation
  docs/api-reference

chore/                   — Maintenance, refactoring
  chore/upgrade-dependencies
```

Choose a convention and stick with it. It makes history readable.

## Merging

When you're done with a branch and want to incorporate it into `main`:

**Visual learner?** Check [Visual Guide: Merging](09-visual-guide.md#merging-non-fast-forward) to see what happens to the commit graph.

### Basic Merge

```bash
git switch main          # Switch to the branch you want to merge INTO
git merge feature/dark-mode
```

Git will merge the changes. If there are no conflicts, you're done.

### Merge with a Commit Message

```bash
git merge --no-ff feature/dark-mode
```

The `--no-ff` flag creates a merge commit even if Git could fast-forward. This preserves the branch history and makes it clear what changes were part of the feature.

## Conflicts

When two branches change the same part of a file, Git can't automatically merge them. You have to resolve the conflict manually.

### Detecting Conflicts

```bash
git merge feature/dark-mode
# Output:
# CONFLICT (content): Merge conflict in styles.css
# Automatic merge failed; fix conflicts and then commit the result.
```

### Resolving Conflicts

Open the conflicted file in your editor. You'll see:

```css
<<<<<<< HEAD
background: white;
=======
background: black;
>>>>>>> feature/dark-mode
```

- `<<<<<<< HEAD` — Your current branch's version
- `=======` — The separator
- `>>>>>>> feature/dark-mode` — The branch being merged in

Choose which version to keep (or combine them):

```css
background: var(--background-color);  /* Supports both light and dark */
```

Then resolve the conflict:

```bash
git add styles.css
git commit -m "Merge feature/dark-mode (resolved conflict in styles.css)"
```

### Aborting a Merge

If the conflict is too messy, abort and try again:

```bash
git merge --abort
```

## Deleting Branches

Once a branch is merged, delete it to keep things clean:

```bash
# Delete locally
git branch -d feature/dark-mode

# Delete on remote
git push origin --delete feature/dark-mode
```

## Remote Branches

### Push a New Branch

```bash
git switch -c feature/new-feature
git add .
git commit -m "Start new feature"
git push -u origin feature/new-feature
```

The `-u` flag sets the upstream, so future `git push` commands default to this branch.

### Track a Remote Branch

If someone else created a branch on the remote and you want to work on it:

```bash
git switch feature/their-feature
```

Git automatically creates a local tracking branch.

### See Remote Branches

```bash
git branch -r
```

This shows all branches on the remote that you're aware of.

## Advanced: Rebasing

Rebasing is an alternative to merging. Instead of creating a merge commit, it replays your commits on top of another branch.

```bash
git switch feature/dark-mode
git rebase main
```

This takes each commit from `feature/dark-mode` and replays them on top of the current `main`. The result is a linear history without merge commits.

**Warning:** Don't rebase branches that other people are using. It rewrites history, which causes problems when they pull. More on this in [Advanced Features](05-advanced.md).

## Common Situations

### I Accidentally Switched Branches and Made Changes

```bash
git stash                          # Save your changes
git switch correct-branch
git stash pop                      # Restore your changes
```

### I Want to See What's Different Between Branches

```bash
git diff main feature/dark-mode
```

This shows all differences between the two branches.

### I Want to Merge But Keep My Branch History Clean

Use rebase instead of merge:
```bash
git switch feature/new-feature
git rebase main
git switch main
git merge feature/new-feature
```

This creates a linear history: `main -> rebase changes on top`.

## Best Practices

- **One feature per branch** — Don't mix unrelated changes
- **Keep branches short-lived** — Merge back to main within a few days if possible
- **Name branches clearly** — Use the convention your team follows
- **Delete merged branches** — Keeps the branch list manageable
- **Pull before you push** — Avoid conflicts by staying up-to-date

## Next Steps

Ready to learn advanced techniques? Jump to [Advanced Features](05-advanced.md).

For team workflows, see [Collaboration Patterns](06-collaboration.md).
