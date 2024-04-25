import * as vscode from 'vscode';
import * as path from 'path';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import { openHTML, openErrorFileInVSCode } from '../utils/NotificationManager';

export class CompilerCaller {
    private static jarPath = path.join(__dirname, '..', '..', 'src', 'compiler', 'LCML.jar');

    static async callCompiler(txtFilePath: string, htmlFilePath: string): Promise<void> {
        if (!await fs.pathExists(CompilerCaller.jarPath)) {
            vscode.window.showErrorMessage('Caminho do compilador JAR não encontrado: ' + CompilerCaller.jarPath);
            return;
        }

        const command = `java -jar "${CompilerCaller.jarPath}" "${txtFilePath}" "${htmlFilePath}"`;
        try {
            const { stdout, stderr } = await this.execPromise(command);
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            if (!await this.checkCompilationErrors(htmlFilePath)) {
                return;
            }

            vscode.window.showInformationMessage(`Arquivo HTML criado com sucesso: ${htmlFilePath}`);
            await openHTML(htmlFilePath);
        } catch (error: any) {
            vscode.window.showErrorMessage('Erro ao converter o arquivo LCML para HTML: ' + error.message);
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

    private static async checkCompilationErrors(htmlFilePath: string): Promise<boolean> {
        const errorsFilePath = await this.findMostRecentErrorFile();
        if (errorsFilePath) {
            const errorsContent = await fs.readFile(errorsFilePath, 'utf8');
            const errors = JSON.parse(errorsContent);
            if (errors.length > 0) {
                vscode.window.showErrorMessage('Não foi possível compilar o arquivo TXT. Verifique os erros no arquivo: ' + path.basename(errorsFilePath));
                console.error('Erros de compilação:', errors);
                await openErrorFileInVSCode(errorsFilePath);
                return false;
            }
        }
        return true;
    }


    private static async findMostRecentErrorFile(): Promise<string | null> {
        const errorsDir = path.join('C:\\Users\\raf4a\\Documents\\LearningCurve');
        const files = await fs.readdir(errorsDir);
        const errorFiles = files.filter(file => file.startsWith('errors') && file.endsWith('.json'));
    
        if (errorFiles.length === 0) {
            return null;
        }
    
        const recentFiles = errorFiles.filter(file => {
            const timestamp = file.slice(7, -5).replace(/_([0-9]{2})-([0-9]{2})-([0-9]{2})$/, 'T$1:$2:$3');
            const fileTime = Date.parse(timestamp);
            const currentTime = Date.now();
            console.log('timestamp', timestamp);
            console.log('fileTime', fileTime);
            console.log('currentTime', currentTime);
            return Math.abs(currentTime - fileTime) < 2 * 60 * 1000;  // 2 minutes
        });
    
        if (recentFiles.length === 0) {
            return null;
        }
    
        const recentFile = recentFiles.sort().reverse()[0];
        return path.join(errorsDir, recentFile);
    }
    
    
    


}
