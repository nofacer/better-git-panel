import * as vscode from 'vscode';
import { GitOperator } from './gitOperator';

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
			this.iconPath = new vscode.ThemeIcon('arrow-small-right');
		}
	}
}

export class BranchesViewProvider implements vscode.TreeDataProvider<BranchItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<BranchItem | undefined | null | void> = new vscode.EventEmitter<BranchItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<BranchItem | undefined | null | void> = this._onDidChangeTreeData.event;

	private gitOperator: GitOperator;
	private gitOutputChannel = vscode.window.createOutputChannel('Better Git Panel');

	constructor(private workspaceRoot: string | undefined) {
		this.gitOperator = new GitOperator(this.workspaceRoot, this.gitOutputChannel);
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: BranchItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: BranchItem): Promise<BranchItem[]> {
		this.gitOutputChannel.appendLine(`[GET_CHILDREN] ${element?.label}`);

		// not workspace
		if (!this.workspaceRoot) {
			return [new BranchItem('No workspace opened', vscode.TreeItemCollapsibleState.None, 'error')];
		}

		// check if it's a git repository
		const isGitRepository = await this.gitOperator.isGitRepository();
		if (!isGitRepository) {
			return [new BranchItem('Not a git repository', vscode.TreeItemCollapsibleState.None, 'error')];
		}

		// render root level - show local and remote branch sections
		if (!element) {
			return [
				new BranchItem('Local Branches', vscode.TreeItemCollapsibleState.Expanded, 'root'),
				new BranchItem('Remote Branches', vscode.TreeItemCollapsibleState.Expanded, 'root')
			];
		}

		// render local and remote branch sections
		if (element.type === 'root') {
			if (element.label === 'Local Branches') {
				const currentBranch = await this.gitOperator.getCurrentBranch();
				const localBranches = await this.gitOperator.getLocalBranches();
				return localBranches.map(branch => new BranchItem(branch, vscode.TreeItemCollapsibleState.None, 'local', branch, branch === currentBranch));
			} else if (element.label === 'Remote Branches') {
				const remoteBranches = await this.gitOperator.getRemoteBranches();
				return remoteBranches.map(branch => new BranchItem(branch, vscode.TreeItemCollapsibleState.None, 'remote', branch));
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