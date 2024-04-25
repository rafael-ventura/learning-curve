import * as vscode from 'vscode';
import { convertLCML } from '../compiler/LCMLConverter';

export function registerCommands(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('learning-curve.LcmlConverter', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || activeEditor.document.languageId !== 'lcml') {
            vscode.window.showErrorMessage('Nenhum arquivo LCML aberto no editor.');
            return;
        }
        try {
            const lcmlFilePath = activeEditor.document.uri.fsPath;
            await convertLCML(lcmlFilePath);
        } catch (error: any) {
            vscode.window.showErrorMessage('Erro ao converter LCML para HTML: ' + error.message);
        }
    });
    context.subscriptions.push(disposable);
}

