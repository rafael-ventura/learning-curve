import * as vscode from 'vscode';

export function readConfig(key: string): any {
    return vscode.workspace.getConfiguration('lcml').get(key);
}

export function writeConfig(key: string, value: any): Thenable<void> {
    return vscode.workspace.getConfiguration('lcml').update(key, value, vscode.ConfigurationTarget.Global);
}
