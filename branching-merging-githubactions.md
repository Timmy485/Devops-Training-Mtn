# GitHub/GitLab Enterprise CI/CD & Security - Trainee Workbook
## 90-Minute Hands-On Session

**Your Mission:** By the end of this session, you'll have hands-on experience with enterprise Git workflows, CI/CD pipelines, and security scanning integration.

**What You'll Build:**
- ✅ A repository with proper branch protection
- ✅ Feature branches with PR/MR workflows
- ✅ Automated CI/CD pipeline with GitHub Actions
- ✅ Security scanning with Fortify SAST/DAST


## 🎯 Prerequisites Checklist
**Before we start, ensure you have:**
### ✅ Account Access
- [ ] GitHub Enterprise organization account (owner/maintainer role)
- [ ] OR GitLab Enterprise group with maintainer access
- [ ] Fortify Software Security Center (SSC) access
- [ ] SSC CI token ready

### ✅ Fortify Components Access
- [ ] ScanCentral SAST controller URL
- [ ] WebInspect Enterprise (WIE) or ScanCentral DAST (optional)

### ✅ Local Tools (Optional but Helpful)
- [ ] Git CLI installed
- [ ] Node.js
- [ ] Code editor (VS Code, WebStorm, etc.)


## 🏗️ Lab 1: Repository Setup (12 minutes)
### Option A: GitHub Enterprise
#### Step 1: Create Your Repository
1. Navigate to your GitHub Enterprise organization
2. Click **"New"** → **"Repository"**
3. Repository name: `mobile-money-api`
4. Set visibility to **Internal** or **Private**
5. Click **"Create repository"**

#### Step 2: Configure Branch Protection
1. Go to **Settings** → **Branches**
2. Click **"Add rule"**
3. Branch name pattern: `main`
4. Enable these settings:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (set to 1)
   - ✅ Require status checks to pass before merging
   - ✅ Do not allow bypassing the above settings
5. Click **"Create"**

#### Step 3: Add Team Members
1. Go to **Settings** → **Collaborators and teams**
2. Click **"Add teams"** or **"Add people"**
3. Add your team with **Write** or **Maintain** access

### Option B: GitLab Enterprise
#### Step 1: Create Your Project
1. Navigate to your GitLab Enterprise group
2. Click **"New project"** → **"Create blank project"**
3. Project name: `demo-ci-security`
4. Set visibility to **Private**
5. ✅ Check **"Initialize repository with a README"**
6. Click **"Create project"**

#### Step 2: Protect Main/Master Branch
1. Go to **Settings** → **Repository**
2. Expand **"Protected branches"**
3. Select `main` branch
4. Set **"Allowed to merge"** to **Maintainers**
5. Set **"Allowed to push"** to **No one**
6. Click **"Protect"**

#### Step 3: Add Team Members
1. Go to **Project information** → **Members**
2. Click **"Invite members"**
3. Add team members with **Developer** or **Maintainer** role

### Step 4: Clone the Training Repository

**Open your terminal and run:**
```bash
# Clone the training repository
git clone https://github.com/brudex/Devops-Training-Mtn.git

# Navigate to the repository
cd Devops-Training-Mtn
# Add your new repository as a remote
git remote add origin <YOUR_REPO_URL>
# Push to your new repository
git push -u origin main
```

**✅ Checkpoint:** You should now have a repository with branch protection enabled and the training code pushed to it.
---

## 🌿 Lab 2: Branching & Pull Requests (18 minutes)

### Step 1: Create a Feature Branch

```bash
# Create and switch to a new feature branch
git checkout -b feat/welcome-message
# Verify you're on the new branch
git branch
```

### Step 2: Make Your Changes

**Task:** Modify one of the application files to add a welcome message or new feature.

**Example changes you could make:**
- Add a new API endpoint
- Update the UI with a welcome message
- Add a new configuration option
- Improve existing functionality

**Make your changes using your preferred editor, then:**

```bash
# Check what files have changed
git status

# See the specific changes
git diff
```

### Step 3: Commit and Push Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add welcome message to homepage"

# Push the branch to remote
git push -u origin feat/welcome-message
```

### Step 4: Create a Pull Request (GitHub) or Merge Request (GitLab)

#### For GitHub:
1. Go to your repository on GitHub
2. You should see a **"Compare & pull request"** button - click it
3. Fill in the PR details:
   - **Title:** Clear, descriptive title
   - **Description:** What does this change do and why?
4. **Add reviewers** from your team
5. Click **"Create pull request"**

#### For GitLab:
1. Go to your project on GitLab
2. Click **"Merge requests"** → **"New merge request"**
3. Select source branch: `feat/welcome-message`
4. Select target branch: `main`
5. Fill in the MR details and add an approver
6. Click **"Create merge request"**

### Step 5: Review Process Checklist

**As a reviewer, check:**
- [ ] Does the code solve the stated problem?
- [ ] Are there any obvious bugs or issues?
- [ ] Does it follow coding standards?
- [ ] Are there adequate tests?
- [ ] Is the commit message clear?

**✅ Checkpoint:** Your PR/MR should be created and ready for review. Notice how branch protection prevents direct pushes to `main`.

---

## ⚔️ Lab 3: Merge Conflicts & Resolution (14 minutes)

### Step 1: Create a Conflicting Branch

**Open a new terminal window (keep the first one open):**

```bash
# Ensure you're in the repository directory
cd Devops-Training-Mtn

# Create a conflicting branch from main
git checkout main
git pull origin main
git checkout -b fix/readme-hotfix

# Make a change to the same file you modified earlier
echo "## Hotfix Update" >> README.md

# Commit and push
git add README.md
git commit -m "fix: add hotfix section to readme"
git push -u origin fix/readme-hotfix
```

### Step 2: Create the Conflict Scenario

1. **First:** Go to your GitHub/GitLab interface
2. **Approve and merge** your `feat/welcome-message` PR/MR first
3. **Then:** Create a new PR/MR for `fix/readme-hotfix`
4. **Notice:** GitHubLab will detect the conflict!

### Step 3: Resolve the Conflict Locally

```bash
# Switch to your conflict branch
git checkout fix/readme-hotfix

# Pull the latest changes from main (this will create the conflict)
git pull --rebase origin main

# Git will pause and show you the conflicts
git status
```

**You'll see output like:**
```
Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   README.md
```

### Step 4: Edit the Conflicted File (You can use a mergetool)

**Open README.md in your editor. You'll see conflict markers:**

```
<<<<<<< HEAD
## Hotfix Update
=======
## Your other changes from the feature branch
>>>>>>> commit-hash
```

**Manual Resolution:**
1. Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
2. Keep the content you want from both versions
3. Save the file

**Alternative - Use a Merge Tool:**
```bash
# Configure a merge tool (optional)
git config --global merge.tool kdiff3

# Use the merge tool
git mergetool
```

### Step 5: Complete the Resolution

```bash
# Stage the resolved file
git add README.md

# Continue the rebase
git rebase --continue

# Force push (since we rebased)
git push --force-with-lease
```

### Step 6: Complete the Merge

1. Go back to your PR/MR
2. The conflict should now be resolved
3. **Approve and merge** the PR/MR
4. Verify that branch protection rules worked (required checks, approvals)

**✅ Checkpoint:** You've successfully resolved a merge conflict and understand how branch protection works.

---

## 🤖 Lab 4: CI/CD Pipeline Setup (18 minutes)
### Step 1: Create the GitHub Actions Workflow

**Create the workflow directory and file:**

```bash
# Create the workflow directory structure
mkdir -p .github/workflows

# Create the CI workflow file
touch .github/workflows/ci.yml
```

 
### Resources for Continued Learning

**📚 Documentation:**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [Fortify SAST Documentation](https://www.microfocus.com/documentation/fortify-sca)

**🛠️ Tools to Explore:**
- **Dependabot** for dependency updates
- **CodeQL** for additional SAST capabilities  
- **OWASP ZAP** as an alternative DAST tool
- **Terraform** for Infrastructure as Code
