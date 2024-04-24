// utils/NotificationManager.ts
import * as vscode from 'vscode';

export class NotificationManager {
    static async showErrorMessage(message: string) {
        return await vscode.window.showErrorMessage(message);
    }

    static async showInfoMessage(message: string) {
        return await vscode.window.showInformationMessage(message);
    }

    static async showWarningMessage(message: string) {
        return await vscode.window.showWarningMessage(message);
    }

    static async showPrompt(options: { prompt: string, placeHolder: string, value?: string }): Promise<string | undefined> {
        return await vscode.window.showInputBox(options);
    }

    static async showQuickPick(options: string[], placeHolder: string): Promise<string | undefined> {
        return await vscode.window.showQuickPick(options, { placeHolder });
    }
}
