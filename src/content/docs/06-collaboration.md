---
title: 6. Collaboration Patterns
---

Work effectively with teammates using Git.

## The Pull Request Workflow

Most teams use this pattern:

1. Create a branch for your feature
2. Make commits and push to the remote
3. Open a Pull Request (PR) for code review
4. Address feedback
5. Merge when approved

### Step 1: Create a Branch

```bash
git switch -c feature/dark-mode
```

Use clear naming (see [Branching & Merging](../04-branching/) for conventions).

### Step 2: Make and Push Commits

```bash
git add .
git commit -m "Add dark mode toggle to header"
git commit -m "Add dark mode styles"
git push -u origin feature/dark-mode
```

Push frequently. It's a backup and lets teammates see your progress.

### Step 3: Open a Pull Request

On GitHub/GitLab, create a PR from your branch to `main`. Include:

- **Title** — One-line summary of the change
- **Description** — Why the change exists, how it works, any caveats
- **Screenshots** — For UI changes
- **Related issues** — Link to any issues this fixes (e.g., "Fixes #123")

Example description:
```
## What
Add dark mode support to the app.

## Why
Users have requested dark mode for years. This is the top feature
request on our feedback board.

## How
- New toggle in the header
- CSS variables for light/dark colors
- localStorage to persist user preference

## Testing
Tested in Chrome, Firefox, and Safari on macOS and Windows.
Dark mode toggle persists across page refreshes.

Fixes #1234
```

### Step 4: Code Review

Teammates review your code. They might request changes:
- "Can you add a test for this?"
- "Should we handle the error case here?"
- "Let's simplify this logic"

Address feedback by:
1. Making the requested changes
2. Committing them
3. Pushing to the branch
4. Replying with what you changed

**Important:** Don't force-push after review. It rewrites history and makes it hard to see what changed.

### Step 5: Merge

Once approved, merge the PR:

```bash
# On the PR page, click "Merge"
```

Or command line:
```bash
git switch main
git pull
git merge feature/dark-mode
git push
```

Then delete the branch:
```bash
git branch -d feature/dark-mode
git push origin --delete feature/dark-mode
```

## Collaboration Strategies

### Keep Main Stable

**Rule:** Never push directly to `main`. Always use branches and PRs.

This ensures:
- Code is reviewed before merging
- Tests pass before production
- History is clean and traceable

### Rebase Feature Branches Before Merging

Before opening a PR or merging, rebase your branch on the latest main:

```bash
git fetch
git rebase origin/main
git push --force-with-lease origin feature/dark-mode
```

This integrates recent changes from main and prevents conflicts.

**Note:** Use `--force-with-lease` instead of `--force`. It's safer (won't overwrite remote changes you didn't expect).

### Squash Commits When Merging

Keep main's history clean. Instead of merging all commits:

```bash
git merge --squash feature/dark-mode
git commit -m "Add dark mode support"
git push
```

This creates one clean commit on main.

Alternatively, some teams use "squash and merge" on the PR page.

### Commit Hygiene

Write commits that tell a story:

**Bad:**
```
Update files
Fix stuff
WIP
Finish feature
```

**Good:**
```
Add dark mode toggle to header
Add CSS variables for theme colors
Persist dark mode preference to localStorage
```

Each commit should be a logical, self-contained change.

## Handling Merge Conflicts

When your branch conflicts with main:

### Option 1: Rebase and Resolve

```bash
git fetch
git rebase origin/main
```

Git pauses on conflicts. Resolve them:

```bash
# Edit conflicted files
git add .
git rebase --continue
```

### Option 2: Merge and Resolve

```bash
git fetch
git merge origin/main
```

Resolve conflicts:

```bash
# Edit conflicted files
git add .
git commit -m "Merge main into feature branch"
```

### Preventing Conflicts

- Pull/fetch often to stay synchronized
- Avoid editing the same files as teammates
- Communicate about what you're working on

## Code Review Best Practices

### For Reviewers

- **Be constructive** — "Why not use const instead?" not "This is wrong"
- **Approve when satisfied** — Don't block on minor style issues
- **Ask questions** — "What's the purpose of this logic?"
- **Suggest, don't demand** — "We could also..." vs "You must..."
- **Review promptly** — Hours, not days

### For Authors

- **Keep PRs small** — Easier to review, easier to understand
- **Explain your intent** — The code shows what, the description shows why
- **Be responsive** — Address feedback quickly
- **Ask for clarification** — If feedback is unclear
- **Don't take it personally** — Code review is about the code, not you

## Team Workflows

### Feature Branch Workflow

Each feature gets its own branch, reviewed before merging to main.

```
main (always stable)
├── feature/dark-mode
├── feature/user-profiles
└── fix/login-timeout
```

**Best for:** Most teams and projects.

### Git Flow

More complex branching model with `develop` and `release` branches.

```
main (releases only)
├── develop (integration branch)
├── feature/... (merged into develop)
└── release/... (bugfixes before release)
```

**Best for:** Large teams, scheduled releases.

### Trunk-Based Development

Everyone commits directly to main, feature flags control visibility.

```
main
├── [commit with feature flag: disabled]
├── [commit with feature flag: enabled]
└── [commit with feature flag: removed]
```

**Best for:** Continuous deployment, very communicative teams.

## Protecting Main

Set up branch protection rules to enforce standards:

- Require PR reviews before merging
- Require CI/CD tests to pass
- Require status checks (linting, type checking)
- Prevent force-pushing
- Dismiss stale PR approvals when new commits are pushed

This prevents accidents and ensures quality.

## Handling Urgent Fixes

Sometimes you need to fix a critical bug immediately.

### If It's a One-Line Fix

```bash
git switch main
git switch -c fix/critical-bug
git commit -m "Fix critical bug"
git push -u origin fix/critical-bug
# Open PR, get quick review, merge
```

### If It's Complex

Use the same process but loop in senior developers for fast review.

## Common Team Patterns

### "Rebase and squash before merge"

```bash
git fetch
git rebase origin/main
git push --force-with-lease
# Then squash and merge on the PR page
```

Keeps main's history clean with one commit per feature.

### "Merge with merge commits"

```bash
git merge --no-ff feature/dark-mode
```

Preserves branch history, making it clear what changes were part of the feature.

### "Rebase on main, then merge without merge commit"

```bash
git rebase origin/main
git merge --ff-only
```

Clean linear history.

## Remote Collaboration

### Push Frequently

```bash
git push origin feature/dark-mode
```

This backs up your work and lets teammates see your progress.

### Fetch Before Working

```bash
git fetch
```

Update your local view of remote branches. Do this daily.

### Keep Branches Up-to-Date

```bash
git fetch
git rebase origin/main
git push --force-with-lease
```

Prevents your branch from diverging too far from main.

## Issues and Discussions

Link commits and PRs to issues:

In commit messages:
```
Fix form validation

Fixes #123
```

In PR description:
```
Fixes #123
Depends on #456
```

GitHub auto-closes issues when the PR is merged.

## Communication

### When Opening a PR

- Tag reviewers: `@teammate`
- Explain non-obvious changes
- Link related work
- Mention if it's urgent

### When Reviewing

- Comment with context, not just "LGTM"
- Ask questions if you don't understand
- Suggest improvements, don't demand

### When Merging

- Thank the reviewers
- Celebrate the merge (for team morale)
- Note any follow-up work needed

## Best Practices

- **One PR = one feature** — Mix concerns only when necessary
- **Keep PRs under 400 lines** — Easier to review thoroughly
- **Never force-push to main** — Ever
- **Require code review** — Even for senior developers
- **Protect your main branch** — Use GitHub/GitLab settings
- **Automate what you can** — Tests, linting, formatting

## Next Steps

Ready for disaster recovery? Jump to [Fixing Mistakes](../07-troubleshooting/).

Or check out [Command Reference](../08-reference/) for a quick lookup.
