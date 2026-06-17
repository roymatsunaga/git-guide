# 2. Installation

Get Git running on your machine in 5 minutes.

## macOS

### Via Homebrew (Recommended)

If you have [Homebrew](https://brew.sh) installed:

```bash
brew install git
```

Verify installation:
```bash
git --version
```

### Via Xcode Command Line Tools

If you're a Mac developer, the easiest option is often the Xcode Command Line Tools:

```bash
xcode-select --install
```

A dialog will appear. Click **Install** and wait for completion. Then verify:
```bash
git --version
```

### Via Official Installer

1. Download the latest macOS installer from [git-scm.com](https://git-scm.com/download/mac)
2. Open the `.dmg` file and run the installer
3. Follow the prompts (defaults are fine)
4. Verify: `git --version`

## Linux

### Debian / Ubuntu

```bash
sudo apt update
sudo apt install git
```

### Fedora / RHEL / CentOS

```bash
sudo dnf install git
```

Or for older CentOS:
```bash
sudo yum install git
```

### Arch Linux

```bash
sudo pacman -S git
```

Verify installation on any Linux distribution:
```bash
git --version
```

## Initial Setup

Once Git is installed, configure your identity. Git uses this for every commit you make:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email (preferably the same email you use on GitHub or your team's Git server).

Verify your configuration:
```bash
git config --global --list
```

You should see your name and email in the output.

## That's It

You're ready to use Git. Next: [Basic Workflow](03-basics)
