import * as vscode from 'vscode';
import { registerCommands } from './Commands';
import { showJavaDownloadPrompt} from '../utils/JavaVersionChecker';

export function activate(context: vscode.ExtensionContext) {
    console.log('LCML Editor ativado.');
    registerCommands(context);

    const firstActivation = context.globalState.get('activatedForTheFirstTime', true);
    if (firstActivation) {
        showJavaDownloadPrompt();
        context.globalState.update('activatedForTheFirstTime', false);
    }
}
