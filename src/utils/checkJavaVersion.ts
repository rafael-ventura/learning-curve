import * as child_process from 'child_process';

export async function checkJavaVersion(): Promise<string | null> {
    return new Promise((resolve, reject) => {
        child_process.exec('java --version', (error, stdout, stderr) => {
            if (error) {
                console.error('Erro ao verificar a versão do Java:', error);
                reject(error);
            } else {
                const javaVersion = stdout.trim();
                resolve(javaVersion);
            }
        });
    });
}