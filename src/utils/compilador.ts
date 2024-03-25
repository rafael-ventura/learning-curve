import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';

export async function callLCMLCompiler(txtFilePath: string, htmlFilePath: string): Promise<void> {
    try {
        const jarPath = path.join(__dirname, '..', 'compiler', 'LCML.jar');

        if (!await fs.pathExists(jarPath)) {
            vscode.window.showErrorMessage('Compilador JAR não encontrado.');
            return;
        }

        // Comando para executar o compilador JAR
        const command = `java -jar "${jarPath}" "${txtFilePath}" "${htmlFilePath}"`;

        // Executar o comando no terminal
        child_process.exec(command, async (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage('Erro ao converter o arquivo TXT para HTML.');
                console.error('Erro ao converter o arquivo TXT para HTML:', error);
                return;
            }

            // Verificar se o arquivo HTML está vazio
            const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
            if (!htmlContent.trim()) {
                // Se o arquivo HTML estiver vazio, preencher com um esqueleto indicando que a compilação falhou
                const emptyHTML = generateEmptyHTML();
                await fs.writeFile(htmlFilePath, emptyHTML);
                vscode.window.showErrorMessage('Erro ao converter o arquivo TXT para HTML.');
            } else {
                vscode.window.showInformationMessage('Arquivo HTML criado com sucesso.');
            }
        });

        console.log("Comando executado com sucesso:", command);
    } catch (error) {
        vscode.window.showErrorMessage('Erro ao converter o arquivo TXT para HTML.');
        console.error('Erro ao converter o arquivo TXT para HTML:', error);
    }
}

// Função para gerar o esqueleto do HTML quando a compilação falha
function generateEmptyHTML(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Compilação Falhou</title>
    </head>
    <body>
        <h1>Compilação Falhou</h1>
        <p>O arquivo não foi compilado corretamente.</p>
    </body>
    </html>`;
}
