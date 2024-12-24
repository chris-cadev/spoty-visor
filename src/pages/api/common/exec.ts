import { exec as nodeExec } from 'node:child_process';

export const exec = (command: string): Promise<{ output: string[], error?: string }> => new Promise((resolve, reject) => {
    nodeExec(command, (error, stdout, stderr) => {
        if (error) {
            reject({ error, output: stderr.trim().split("\n") });
        } else {
            resolve({ output: stdout.trim().split("\n") });
        }
    });
});