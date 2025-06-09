import * as vscode from 'vscode';
import { BranchesViewProvider } from './branchesViewProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "better-git-panel" is now active!');

	const disposable = vscode.commands.registerCommand('better-git-panel.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Better Git Panel!');
	});

	const branchesProvider = new BranchesViewProvider();
	vscode.window.registerTreeDataProvider('branches', branchesProvider);

	context.subscriptions.push(disposable);
}

export function deactivate() { }
