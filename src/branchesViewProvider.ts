import * as vscode from 'vscode';

class BranchItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(label, collapsibleState)
	}
}

export class BranchesViewProvider implements vscode.TreeDataProvider<BranchItem> {
	onDidChangeTreeData?: vscode.Event<void | BranchItem | BranchItem[] | null | undefined> | undefined;
	getTreeItem(element: BranchItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}
	getChildren(element?: BranchItem | undefined): vscode.ProviderResult<BranchItem[]> {
		throw new Error('Method not implemented.');
	}
	getParent?(element: BranchItem): vscode.ProviderResult<BranchItem> {
		throw new Error('Method not implemented.');
	}
	resolveTreeItem?(item: vscode.TreeItem, element: BranchItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}

}