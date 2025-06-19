import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Create an output channel for logging git commands
const gitOutputChannel = vscode.window.createOutputChannel('Better Git Panel');

// Wrapper to log git commands and their output/errors
async function runGitCommand(command: string, cwd: string) {
	gitOutputChannel.appendLine(`[CMD] ${command}`);
	try {
		const result = await execAsync(command, { cwd });
		gitOutputChannel.appendLine(`[OUT] ${result.stdout}`);
		if (result.stderr) {
			gitOutputChannel.appendLine(`[ERR] ${result.stderr}`);
		}
		return result;
	} catch (error: any) {
		gitOutputChannel.appendLine(`[FAIL] ${error.message}`);
		throw error;
	}
}

class BranchItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly type: 'local' | 'remote' | 'root' | 'error',
		public readonly branchName?: string,
		public readonly isCurrentBranch: boolean = false
	) {
		super(label, collapsibleState);
		this.contextValue = type;
		if (isCurrentBranch) {
			this.iconPath = new vscode.ThemeIcon('star-full');
		}
	}
}

export class BranchesViewProvider implements vscode.TreeDataProvider<BranchItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<BranchItem | undefined | null | void> = new vscode.EventEmitter<BranchItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<BranchItem | undefined | null | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) { }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: BranchItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: BranchItem): Promise<BranchItem[]> {
		if (!this.workspaceRoot) {
			return [new BranchItem('No workspace opened', vscode.TreeItemCollapsibleState.None, 'error')];
		}

		if (!element) {
			// Root level - show local and remote branch sections
			return [
				new BranchItem('Local Branches', vscode.TreeItemCollapsibleState.Expanded, 'root'),
				new BranchItem('Remote Branches', vscode.TreeItemCollapsibleState.Expanded, 'root')
			];
		}

		try {
			// Check if it's a git repository
			await runGitCommand('git rev-parse --is-inside-work-tree', this.workspaceRoot);
		} catch (error) {
			return [new BranchItem('Not a git repository', vscode.TreeItemCollapsibleState.None, 'error')];
		}

		if (element.type === 'root') {
			if (element.label === 'Local Branches') {
				const { stdout: currentBranchStdout } = await runGitCommand('git symbolic-ref --short HEAD', this.workspaceRoot);
				const currentBranch = currentBranchStdout.trim();

				const { stdout } = await runGitCommand('git branch --format="%(refname:short)"', this.workspaceRoot);
				return stdout.split('\n')
					.filter(branch => branch.trim())
					.map(branch => {
						const trimmed = branch.trim();
						return new BranchItem(trimmed, vscode.TreeItemCollapsibleState.None, 'local', trimmed, trimmed === currentBranch);
					});
			} else if (element.label === 'Remote Branches') {
				const { stdout } = await runGitCommand('git branch -r --format="%(refname:short)"', this.workspaceRoot);
				return stdout.split('\n')
					.filter(branch => branch.trim())
					.map(branch => new BranchItem(branch.trim(), vscode.TreeItemCollapsibleState.None, 'remote', branch.trim()));
			}
		}

		return [];
	}

	getParent?(element: BranchItem): vscode.ProviderResult<BranchItem> {
		throw new Error('Method not implemented.');
	}
	resolveTreeItem?(item: vscode.TreeItem, element: BranchItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}
}