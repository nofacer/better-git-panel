import * as vscode from 'vscode';
import { BranchesViewProvider } from './branchesViewProvider';
import { BranchItem } from './branchItem';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "better-git-panel" is now active!');

	const branchesProvider = new BranchesViewProvider(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath);
	vscode.window.registerTreeDataProvider('branches', branchesProvider);

	// Register refresh command
	const refreshCommand = vscode.commands.registerCommand('better-git-panel.refreshBranches', () => {
		branchesProvider.refresh();
	});

	const deleteBranchCommand = vscode.commands.registerCommand('better-git-panel.deleteBranch', async (item: BranchItem) => {
		if (item.type === 'local') {
			await branchesProvider.gitOperator.deleteLocalBranch(item.branchName!);
		}
		branchesProvider.refresh();
	});

	const checkoutCommand = vscode.commands.registerCommand('better-git-panel.checkoutBranch', async (item: BranchItem) => {
		await branchesProvider.gitOperator.checkoutBranch(item.branchName!);
		branchesProvider.refresh();
	});

	const rebaseCurrentBranchCommand = vscode.commands.registerCommand('better-git-panel.rebaseCurrentBranch',async ()=>{
		await branchesProvider.gitOperator.rebaseCurrentBranch();
		branchesProvider.refresh();
	});

	const createBranchCommand = vscode.commands.registerCommand('better-git-panel.createBranch', async (item: BranchItem) => {
		const branchName = await vscode.window.showInputBox({
			prompt: 'Enter the name of the new branch',
			placeHolder: 'e.g. feature/new-feature'
		});
		if (branchName) {
			await branchesProvider.gitOperator.createBranch(item.branchName!, branchName);	
			await branchesProvider.gitOperator.checkoutBranch(branchName);
		}
		branchesProvider.refresh();
	});

	context.subscriptions.push(refreshCommand);
	context.subscriptions.push(deleteBranchCommand);
	context.subscriptions.push(checkoutCommand);
	context.subscriptions.push(rebaseCurrentBranchCommand);
	context.subscriptions.push(createBranchCommand);
}

export function deactivate() { }
