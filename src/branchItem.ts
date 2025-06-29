import * as vscode from 'vscode';

export class BranchItem extends vscode.TreeItem {
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