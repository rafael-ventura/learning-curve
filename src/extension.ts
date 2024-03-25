import * as vscode from 'vscode';
import { showJavaDownloadPrompt } from './utils/showJavaDownloadPrompt';
import { convertLCML } from './utils/convertLCML';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Editor de Texto LCML ativado.');

    let disposable = vscode.commands.registerCommand('learning-curve.LcmlConverter', async () => {
        try {
            // Verifica se há um arquivo LCML aberto no editor
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor || activeEditor.document.languageId !== 'lcml') {
                vscode.window.showErrorMessage('Nenhum arquivo LCML aberto no editor.');
                return;
            }

            const lcmlFilePath = activeEditor.document.uri.fsPath;
            console.log('Arquivo LCML:', lcmlFilePath);
            await convertLCML(lcmlFilePath);
        } catch (error) {
            console.error('Erro ao converter LCML para HTML:', error);
            vscode.window.showErrorMessage('Erro ao converter LCML para HTML. Consulte o console para mais detalhes.');
        }
    });

    console.log('Comando LcmlConverter registrado.');
    const activatedForTheFirstTime = context.globalState.get('activatedForTheFirstTime', true);
    if (activatedForTheFirstTime) {
        console.log('Mostrando prompt para baixar Java...');
        context.globalState.update('activatedForTheFirstTime', false);
        showJavaDownloadPrompt();
    }
    
    context.subscriptions.push(disposable);
}
