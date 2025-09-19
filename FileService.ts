import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

export interface FileResult {
    path: string;
    success: boolean;
    data?: any;
    error?: string;
}

export class FileService {
    async readFiles(paths: string[]): Promise<FileResult[]> {
        return paths.map( path => {
            try {
                let data = fs.readFileSync(__dirname + path, 'utf8');
                data = JSON.parse(data);
                const result:FileResult = {
                    path,
                    success: true,
                    data,
                };
                return result;
            } catch(err: any) {
                const result:FileResult = {
                    path,
                    success: false,
                    error: err.message
                };
                return result;
            }
        });
    }
}