import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export class GitOperator {
	constructor(private workspaceRoot: string | undefined, private gitOutputChannel: vscode.OutputChannel) { }

	async runGitCommand(command: string) {
		if (!this.workspaceRoot) {
			this.gitOutputChannel.appendLine('[ERR] No workspace opened');
			return { stdout: '', stderr: 'No workspace opened' };
		}
		this.gitOutputChannel.appendLine(`[CMD] ${command}`);
		try {
			const result = await execAsync(command, { cwd: this.workspaceRoot });
			this.gitOutputChannel.appendLine(`[OUT] ${result.stdout}`);
			if (result.stderr) {
				this.gitOutputChannel.appendLine(`[ERR] ${result.stderr}`);
			}
			return result;
		} catch (error: any) {
			this.gitOutputChannel.appendLine(`[FAIL] ${error.message}`);
			throw error;
		}
	}

	async isGitRepository(): Promise<boolean> {
		try {
			await this.runGitCommand('git rev-parse --is-inside-work-tree');
			return true;
		} catch (error) {
			return false;
		}
	}

	async getCurrentBranch(): Promise<string> {
		const { stdout } = await this.runGitCommand('git symbolic-ref --short HEAD');
		return stdout.trim();
	}

	async getRemoteBranches() {
		const { stdout } = await this.runGitCommand('git branch -r --format="%(refname:short)"');
		return stdout.split('\n')
			.filter(branch => branch.trim())
			.map(branch => branch.trim());
	}

	async getLocalBranches() {
		const { stdout } = await this.runGitCommand('git branch --format="%(refname:short)"');
		return stdout.split('\n')
			.filter(branch => branch.trim())
			.map(branch => branch.trim());
	}
}