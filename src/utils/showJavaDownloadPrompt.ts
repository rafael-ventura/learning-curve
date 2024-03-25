import * as vscode from 'vscode';
import { checkJavaVersion } from './checkJavaVersion';

export async function showJavaDownloadPrompt() {
    const javaVersion = await checkJavaVersion();
    if (javaVersion && javaVersion.startsWith('java 20')) {
        const response = await vscode.window.showInformationMessage("Parabéns! Você já tem o JDK 20 ou superior instalado.", "Ok");

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
