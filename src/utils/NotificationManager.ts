// utils/NotificationManager.ts
import * as vscode from 'vscode';

export async function showErrorMessage(message: string) {
    return await vscode.window.showErrorMessage(message);
}

export async function showInfoMessage(message: string) {
    return await vscode.window.showInformationMessage(message);
}

export async function showWarningMessage(message: string) {
    return await vscode.window.showWarningMessage(message);
}

export async function showPrompt(options: { prompt: string, placeHolder: string, value?: string }): Promise<string | undefined> {
    return await vscode.window.showInputBox(options);
}

export async function openErrorFileInVSCode(errorsFilePath: string): Promise<void> {
    const uri = vscode.Uri.file(errorsFilePath);
    try {
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);
    } catch (error: any) {
        vscode.window.showErrorMessage('Erro ao abrir o arquivo de erros: ' + error.message);
    }
}

export async function openHTML(htmlFilePath: string): Promise<void> {
    const uri = vscode.Uri.file(htmlFilePath);
    await vscode.commands.executeCommand('vscode.open', uri);
}

