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
        child_process.exec(command, { cwd: path.dirname(txtFilePath) }, async (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            if (error) {
                vscode.window.showErrorMessage('Erro ao converter o arquivo TXT para HTML.');
                console.error('Erro ao converter o arquivo TXT para HTML:', error);
                return;
            }

            console.log("Comando executado com sucesso:", command);
            // Verificar se o arquivo errors.json foi gerado
            const errorsFilePath = txtFilePath.replace('.txt', '.json');
            if (await fs.pathExists(errorsFilePath)) {
                const errorsContent = await fs.readFile(errorsFilePath, 'utf8');
                const errors = JSON.parse(errorsContent);

                if (errors.length > 0) {
                    vscode.window.showErrorMessage('Erro ao compilar o arquivo TXT.');
                    console.error('Erro ao compilar o arquivo TXT:', errors);
                    return;
                }
            }
        });
    } catch (error) {
        vscode.window.showErrorMessage('Erro ao converter o arquivo TXT para HTML.');
        console.error('Erro ao converter o arquivo TXT para HTML:', error);
    }
}
