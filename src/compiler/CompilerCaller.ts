import * as vscode from 'vscode';
import * as path from 'path';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';

export class CompilerCaller {
    private static jarPath = path.join(__dirname, '..', 'compiler', 'LCML.jar');

    static async callCompiler(txtFilePath: string, htmlFilePath: string): Promise<void> {
        if (!await fs.pathExists(CompilerCaller.jarPath)) {
            vscode.window.showErrorMessage('Compilador JAR não encontrado.');
            return;
        }

        const command = `java -jar "${CompilerCaller.jarPath}" "${txtFilePath}" "${htmlFilePath}"`;
        try {
            const { stdout, stderr } = await this.execPromise(command);
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            // Verificação de erros de compilação no arquivo de erros gerado
            this.checkCompilationErrors();
        } catch (error: any) {
            vscode.window.showErrorMessage('Erro ao converter o arquivo TXT para HTML: ' + error.message);
        }
    }

    private static async execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            childProcess.exec(command, { cwd: path.dirname(CompilerCaller.jarPath) }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Erro de execução: ${stderr}`));
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    }

    private static async checkCompilationErrors() {
        const errorsFilePath = path.join('C:\\Users\\raf4a\\Documents\\LearningCurve', 'errors.json');
        if (await fs.pathExists(errorsFilePath)) {
            const errorsContent = await fs.readFile(errorsFilePath, 'utf8');
            const errors = JSON.parse(errorsContent);
            if (errors.length > 0) {
                vscode.window.showErrorMessage('Não foi possível compilar o arquivo TXT. Verifique os erros no arquivo errors.json.');
                console.error('Erros de compilação:', errors);
            }
        }
    }
}
