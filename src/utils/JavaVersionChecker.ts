import * as childProcess from 'child_process';
import * as vscode from 'vscode';

export async function checkJavaVersion(): Promise<string | null> {
    try {
        const { stdout } = await execPromise('java --version');
        return stdout.trim();
    } catch (error) {
        console.error('Erro ao verificar a versão do Java:', error);
        throw error;
    }
}

export async function showJavaDownloadPrompt() {
    const javaVersion = await checkJavaVersion();
    if (javaVersion && javaVersion.startsWith('java 20')) {
        await vscode.window.showInformationMessage("Parabéns! Você já tem o JDK 20 ou superior instalado.", "Ok");
    } else {
        const response = await vscode.window.showInformationMessage(
            'Para usar esta extensão, é necessário ter o JDK 20 ou superior instalado. Você gostaria de fazer o download do JDK 20?',
            'Sim', 'Cancelar'
        );
        if (response === 'Sim') {
            vscode.env.openExternal(vscode.Uri.parse('https://www.oracle.com/java/technologies/javase/jdk20-archive-downloads.html'));
        }
    }
}

function execPromise(command: string): Promise<{ stdout: string; stderr: string; }> {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}
