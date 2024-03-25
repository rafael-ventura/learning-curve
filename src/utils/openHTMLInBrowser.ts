import * as vscode from 'vscode';

export async function openHTMLInBrowser(htmlFilePath: string): Promise<void> {
    try {
        // Verifica se o arquivo HTML existe
        if (!await vscode.workspace.fs.stat(vscode.Uri.file(htmlFilePath))) {
            vscode.window.showErrorMessage('Arquivo HTML não encontrado.');
            return;
        }

        // Abre o arquivo HTML no navegador padrão
        const uri = vscode.Uri.file(htmlFilePath);
        await vscode.commands.executeCommand('vscode.open', uri);
    } catch (error) {
        vscode.window.showErrorMessage('Erro ao abrir o arquivo HTML no navegador.');
        console.error('Erro ao abrir o arquivo HTML no navegador:', error);
    }
}
