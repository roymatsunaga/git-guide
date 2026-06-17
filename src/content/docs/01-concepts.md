---
title: 1. Core Concepts
---

Understand what Git is and how it works before you start using it.

## What is Version Control?

Version control is a system that tracks changes to files over time. It answers:
- Who changed what?
- When was it changed?
- Why was it changed?
- Can we go back to an earlier version?

Without version control, you might do this:
```
project_v1.zip
project_v2.zip
project_FINAL.zip
project_FINAL_REVISED.zip
project_FINAL_REVISED_ACTUALLY_FINAL.zip
```

With version control, you have one folder and the ability to track every change ever made.

## What is Git?

Git is a **distributed version control system**. This means:
- Every copy of a Git repository (folder) is complete and independent
- You can work offline and sync changes later
- Multiple people can work on the same project without stepping on each other's toes

Git was created by Linus Torvalds in 2005 to manage the Linux kernel (a project with thousands of contributors). It's now the industry standard.

## Core Ideas

### Repository

A **repository** (or "repo") is a folder managed by Git. It contains:
- Your project files
- A hidden `.git` folder that stores all version history

You create a repo with `git init` or clone an existing one with `git clone`.

### Commit

A **commit** is a snapshot of your project at a specific moment in time. Think of it as a save point in a video game.

Each commit is an immutable object that contains:
- **Content snapshot** — The complete state of every tracked file
- **Metadata** — Author, committer, timestamp, commit message
- **Parent reference** — Link to the previous commit (or commits in a merge)
- **Tree object** — A hierarchical reference to all files and directories

Example: "Fix login bug where users can't reset passwords"

#### How Git Stores Content

Git doesn't store diffs (changes); it stores complete snapshots. Here's how it works internally:

**Blob:** Each file is stored as a blob (binary large object) identified by its SHA-1 hash:
```
File content: "Hello, world!"
SHA-1 hash:   2ef7bde608ce5404e97d5f042f95f89f1c232871
```

Git computes the hash of the content. If two files have identical content, they share the same blob (deduplication). Even a single character change produces a different hash and a new blob.

**Tree:** A directory structure is represented as a tree object that maps filenames to blob hashes:
```
.git/objects/
├── ab/
│   └── cd1234...  (blob: README.md content)
├── ef/
│   └── gh5678...  (blob: src/app.js content)
└── trees/
    └── 1a2b3c...  (tree object listing files)
```

A tree object looks like:
```
100644 blob ab cd1234...  README.md
100644 blob ef gh5678...  src/app.js
040000 tree 99 zz9999...  src/
```

This structure creates a hierarchy: a root tree points to blobs (files) and subtrees (directories).

**Commit:** A commit object ties everything together:
```
tree 1a2b3c4d5e6f (the root tree snapshot)
parent abc123def456 (previous commit)
author John Doe <john@example.com> 1718000000 +0000
committer John Doe <john@example.com> 1718000000 +0000

Fix login bug where users can't reset passwords
```

The commit includes:
- `tree` — Hash of the root tree object (entire project snapshot)
- `parent` — Hash of the previous commit (creates the chain)
- `author` — Name, email, and timestamp of who made the changes
- `committer` — Name, email, and timestamp of who created the commit (often same as author)
- `message` — Your commit message

This entire commit object is itself hashed, producing the commit's unique identifier (e.g., `abc123def456`).

#### Tracking Changes

Git compares commits by comparing their tree objects. To see what changed between commits:

```bash
git diff abc123def456 def456abc789
```

Git walks both trees and compares blob hashes. If a blob hash is different, the file changed. If a blob is missing, the file was deleted. If a new blob appears, the file was added.

This is why Git can efficiently tell you exactly what changed—it's comparing hashes, not scanning file contents.

#### Author and Committer

The commit stores two identities:

- **Author** — The person who originally wrote the code. Set by you when you commit.
- **Committer** — The person who created the commit. Usually the same as author, but different in scenarios like:
  - Cherry-picking a commit someone else wrote
  - Rebasing commits others wrote
  - A maintainer merging a pull request

Both include:
- Name and email
- Unix timestamp (seconds since January 1, 1970)
- Timezone offset

Example:
```
author Jane Doe <jane@example.com> 1718000000 +0000
committer maintainer <maint@example.com> 1718001000 +0000
```

#### The Commit Chain

Commits form a linked chain through parent references:

```
[Commit 1] → [Commit 2] → [Commit 3] → [Commit 4]
 (parent)    (parent)      (parent)      (current)
```

Each commit points to its parent. This creates an immutable history—you can't change a commit without changing all commits that follow it (which is why rewriting history is tricky).

#### Immutability and Integrity

Once created, a commit cannot be changed. The commit's hash is computed from its entire contents (tree, parent, author, message, etc.). If anything changes, the hash changes, making it a different commit.

This immutability gives Git its safety guarantee: history is tamper-proof. If someone modifies a commit, the hash no longer matches, and Git detects the tampering.

### Branch

A **branch** is an independent line of development. By default, you work on the `main` (or `master`) branch.

Branches let you:
- Work on new features without affecting the stable code
- Experiment safely
- Prepare code for review before merging back in

Example: Create a `feature/dark-mode` branch to build a dark mode feature without breaking the main app.

### Remote

A **remote** is another copy of your repository, usually on a server. The most common remote is `origin` (typically on GitHub, GitLab, or your company's Git server).

Remotes let you:
- Share code with teammates
- Back up your work
- Collaborate on the same project

### Index (Staging Area)

The **index** (or "staging area") is a holding area between your working files and a commit. It's stored as a file at `.git/index`.

When you change a file:
1. The change exists in your working directory (unstaged)
2. You explicitly stage it with `git add`, which writes the file content to the object store and updates the index
3. You create a commit with `git commit`, which creates a new commit object from the staged files

#### How Staging Works

When you run `git add filename.txt`:

1. Git reads the file from disk
2. Computes its SHA-1 hash
3. Stores the file content as a blob object in `.git/objects/`
4. Updates the index file to point to that blob's hash

The index now contains:
```
filename.txt → blob_hash_abc123def456
another.js  → blob_hash_def456abc123
```

When you run `git commit`, Git:

1. Reads the index to get all staged file hashes
2. Creates a tree object from those hashes
3. Creates a commit object pointing to that tree
4. Updates the current branch to point to the new commit

This two-step process lets you craft clean, logical commits. You don't have to commit every change; you can cherry-pick which changes go into each commit by selectively staging files (or parts of files with `git add -p`).

## Git's Object Model

To understand how Git works, you need to know about its core objects and how they relate.

### Objects

Git stores everything as objects, identified by SHA-1 hashes. There are four main types:

**Blob** — A file's content (immutable binary data)
```
Type: blob
Content: function login() { ... }
Hash: abc123def456...
```

**Tree** — A directory listing (maps names to blobs and subtrees)
```
Type: tree
Entries:
  100644 blob abc123 README.md
  100644 blob def456 app.js
  040000 tree ghi789 src/
Hash: tree123def456...
```

**Commit** — A snapshot with metadata
```
Type: commit
Tree: tree123def456
Parent: commit_prev_hash
Author: Jane Doe <jane@example.com> 1718000000 +0000
Committer: Jane Doe <jane@example.com> 1718000000 +0000
Message: Fix login bug
Hash: commit123abc...
```

**Tag** — A named reference to a commit (optional, for releases)
```
Type: tag
Object: commit123abc
Tagger: Jane Doe <jane@example.com>
Name: v1.0.0
Message: Release 1.0
Hash: tag123def...
```

All objects are stored in `.git/objects/` with their hash as the filename.

### References

References (refs) are pointers to commits. They're stored in `.git/refs/` and contain a commit hash.

**Branch** — A reference that moves forward with each commit
```
.git/refs/heads/main
Content: abc123def456... (the commit hash main points to)
```

When you commit on `main`, Git updates this file to point to the new commit.

**HEAD** — A special reference pointing to your current location
```
.git/HEAD
Content: ref: refs/heads/main
```

When you're on the `main` branch, HEAD points to the `main` ref, which points to a commit.

When you do a detached HEAD (checkout a commit directly), HEAD contains the commit hash directly:
```
.git/HEAD
Content: abc123def456...
```

**Remote tracking branch** — A reference tracking a remote branch
```
.git/refs/remotes/origin/main
Content: def456abc123... (the commit hash origin/main points to)
```

When you `git fetch`, Git updates these refs to match what's on the remote.

### The DAG (Directed Acyclic Graph)

Commits form a directed acyclic graph (DAG). Each commit points to its parent(s):

```
     main
       ↓
Commit A ← Commit B ← Commit C
           (merge)     ↙
          Commit D
```

Merge commits have multiple parents. Rebased commits have a linear chain. Branches are just labels pointing to commits in this graph.

This DAG structure is why Git is so powerful:
- You can efficiently find common ancestors
- You can detect cycles (impossible in Git—it's acyclic)
- You can traverse history in multiple directions

## The Git Workflow

Here's how a typical workflow looks:

```
1. Edit files (working directory)
2. Stage changes (git add)
3. Commit changes (git commit)
4. Push to remote (git push)
```

And pulling updates:

```
1. Fetch changes from remote (git fetch or git pull)
2. Merge them into your branch (automatic with git pull)
```

## Key Terminology

| Term | Meaning |
|------|---------|
| **Commit** | A snapshot of the project at a point in time |
| **Branch** | An independent line of development |
| **Main/Master** | The default, production-ready branch |
| **Remote** | A copy of the repo on a server (like GitHub) |
| **Origin** | The default remote, usually where you cloned from |
| **Push** | Send your commits to a remote |
| **Pull** | Fetch and merge changes from a remote |
| **Fetch** | Download changes from a remote without merging |
| **Merge** | Combine changes from one branch into another |
| **Rebase** | Replay commits from one branch onto another (advanced) |
| **Staging** | Preparing changes to be committed |
| **HEAD** | A pointer to the current commit you're on |

## Hashing and Content Addressing

Git uses SHA-1 hashing (and more recently SHA-256) to identify objects. The hash is computed from the object's content.

### Why Hashing Matters

**Content Addressing** — Objects are found by their content hash, not a filename. The same content always produces the same hash:

```
Content: "Hello, world!"
SHA-1: 2ef7bde608ce5404e97d5f042f95f89f1c232871
```

If two files have identical content, they're stored once and referenced twice (deduplication).

**Integrity** — If someone modifies a commit's content, the hash changes. This makes history tamper-proof—you can verify the entire history's integrity by checking hashes.

**Immutability** — A commit's hash includes its content, author, timestamp, and message. Change any detail, and the hash changes. This is why you can't edit a commit without creating a new one.

### In Practice

When you see a commit hash like `abc123def456789`:
- The first 7 characters (`abc123d`) are usually enough to uniquely identify it
- You can use `git show abc123d` to view the full commit
- The full 40-character hash is the complete identifier

## Why This Matters

Git's design solves real problems:

- **Safety** — Every commit is permanent. You can't accidentally lose work.
- **Collaboration** — Multiple people can work on the same project simultaneously.
- **History** — You can see exactly what changed, when, and why.
- **Experimentation** — Branches let you try things without risk.
- **Code Review** — You can review changes before merging.

## Ready to Use It?

Now that you understand the concepts, jump to [Installation](../02-installation/) to get Git running on your machine.
