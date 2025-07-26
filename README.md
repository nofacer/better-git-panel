# Better Git Panel

A powerful VS Code extension that provides an enhanced Git branch management panel for quick and efficient Git operations.

## Features

### 🌿 Branch Management
- **Visual Branch Explorer**: View all local and remote branches in an organized tree structure
- **Current Branch Indicator**: Easily identify your current branch with a visual indicator
- **Branch Operations**: Perform common Git operations directly from the panel

### 🚀 Quick Actions
- **Checkout Branches**: Switch between branches with a single click
- **Create New Branches**: Create and checkout new branches from any existing branch
- **Delete Branches**: Safely delete local branches (with force delete option)
- **Rebase Current Branch**: Pull and merge latest changes from the remote repository

### 🎯 User Interface
- **Dedicated Activity Bar Icon**: Easy access through the VS Code activity bar
- **Context Menus**: Right-click on branches for quick actions
- **Refresh Button**: Manually refresh the branch list
- **Output Channel**: Detailed logging for debugging and monitoring Git operations

## Installation

1. Open VS Code
2. Go to the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Better Git Panel"
4. Click Install

## Usage

### Opening the Panel
1. Click on the Git icon in the VS Code activity bar (left sidebar)
2. The "Branches" view will open, showing your local and remote branches

### Available Commands

#### Panel Commands
- **Refresh Branches**: Update the branch list to reflect current Git state
- **Rebase Current Branch**: Pull and merge latest changes from remote

#### Branch Context Commands (Right-click on branches)
- **Checkout Branch**: Switch to the selected branch
- **Create Branch**: Create a new branch from the selected branch
- **Delete Branch**: Remove the selected local branch

### Branch Types
- **Local Branches**: Branches that exist on your local machine
- **Remote Branches**: Branches that exist on the remote repository
- **Current Branch**: Highlighted with an arrow icon to show your active branch

## Requirements

- VS Code 1.90.0 or higher
- Git repository in your workspace
- Git installed and accessible from command line

## Features in Detail

### Branch Creation
When creating a new branch:
1. Right-click on any branch (local or remote)
2. Select "Create Branch"
3. Enter the new branch name
4. The extension will create the branch and automatically checkout to it

### Branch Deletion
- Only local branches can be deleted
- Uses force delete (`git branch -D`) for safety
- Remote branches cannot be deleted through this panel

### Rebase Operation
The rebase command performs:
1. `git fetch origin` to get latest changes
2. `git merge origin/<current-branch>` to merge changes

## Troubleshooting

### Common Issues
- **"Not a git repository"**: Ensure you're in a Git repository
- **"No workspace opened"**: Open a folder in VS Code
- **Permission errors**: Check Git permissions and credentials

### Output Channel
For detailed debugging:
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Output: Show Output Channel"
3. Select "Better Git Panel" to view detailed logs

## Contributing

This extension is open source. Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This project is licensed under the terms specified in the LICENSE file.

---

**Note**: This extension enhances VS Code's built-in Git functionality by providing a more visual and accessible way to manage Git branches. It's designed to work alongside VS Code's existing Git features, not replace them.
