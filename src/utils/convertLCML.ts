import * as vscode from 'vscode';
import * as path from 'path';
import { callLCMLCompiler } from './compiler';

export async function convertLCML(lcmlFilePath: string): Promise<void> {
    try {
        // Criar uma cópia em formato TXT do arquivo LCML
        const txtFilePath = await createTXTFromLCML(lcmlFilePath);
        if (!txtFilePath) {
            return;
        }

        // Caminho do arquivo HTML de saída
        const htmlFilePath = txtFilePath.replace('.txt', '.html');
        
        console.log('Arquivo HTML:', htmlFilePath);

        // Chamar o compilador JAR para converter o arquivo TXT para HTML
        await callLCMLCompiler(txtFilePath, htmlFilePath);

        // Mostrar mensagem de sucesso
        vscode.window.showInformationMessage(`Arquivo HTML criado com sucesso: ${htmlFilePath}`);

        // Abrir o arquivo HTML
        const htmlDocument = await vscode.workspace.openTextDocument(htmlFilePath);
        await vscode.window.showTextDocument(htmlDocument);
    } catch (error) {
        vscode.window.showErrorMessage('Erro ao converter o arquivo LCML para HTML.');
        console.error('Erro ao converter o arquivo LCML para HTML:', error);
    }
}

async function createTXTFromLCML(lcmlFilePath: string): Promise<string | null> {
    try {
        // Caminho do arquivo TXT
        const txtFilePath = lcmlFilePath.replace('.lcml', '.txt');
        console.log('Arquivo TXT:', txtFilePath);

        // Ler o conteúdo do arquivo LCML
        const lcmlContent = await vscode.workspace.fs.readFile(vscode.Uri.file(lcmlFilePath));

        // Salvar o conteúdo como arquivo TXT (sobrescrever se existir)
        await vscode.workspace.fs.writeFile(vscode.Uri.file(txtFilePath), lcmlContent);

        vscode.window.showInformationMessage(`Arquivo TXT criado com sucesso: ${path.basename(txtFilePath)}`);
        return txtFilePath;
    } catch (error) {
        vscode.window.showErrorMessage('Erro ao criar o arquivo TXT.');
        console.error('Erro ao criar o arquivo TXT:', error);
        return null;
    }
}
