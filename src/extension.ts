import * as vscode from 'vscode';
import { BranchesViewProvider } from './branchesViewProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "better-git-panel" is now active!');

	const branchesProvider = new BranchesViewProvider(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath);
	vscode.window.registerTreeDataProvider('branches', branchesProvider);

	// Register refresh command
	const refreshCommand = vscode.commands.registerCommand('better-git-panel.refreshBranches', () => {
		branchesProvider.refresh();
	});

	context.subscriptions.push(refreshCommand);
}

export function deactivate() { }
