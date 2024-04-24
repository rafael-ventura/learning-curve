import * as vscode from 'vscode';
import * as path from 'path';
import { CompilerCaller } from './CompilerCaller';

export async function convertLCML(lcmlFilePath: string): Promise<void> {
    try {
        const txtFilePath = lcmlFilePath.replace('.lcml', '.txt');
        const htmlFilePath = txtFilePath.replace('.txt', '.html');

        const lcmlContent = await vscode.workspace.fs.readFile(vscode.Uri.file(lcmlFilePath));
        await vscode.workspace.fs.writeFile(vscode.Uri.file(txtFilePath), lcmlContent);
        vscode.window.showInformationMessage(`Arquivo TXT criado com sucesso: ${path.basename(txtFilePath)}`);

        await CompilerCaller.callCompiler(txtFilePath, htmlFilePath);
        vscode.window.showInformationMessage(`Arquivo HTML criado com sucesso: ${htmlFilePath}`);
        await openHTMLInBrowser(htmlFilePath);
    } catch (error: any) {
        vscode.window.showErrorMessage('Erro ao converter LCML para HTML: ' + error.message);
    }
}

async function openHTMLInBrowser(htmlFilePath: string): Promise<void> {
    const uri = vscode.Uri.file(htmlFilePath);
    await vscode.commands.executeCommand('vscode.open', uri);
}
