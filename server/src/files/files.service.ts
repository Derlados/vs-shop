import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as uuid from 'uuid';
import * as fs from 'fs';


@Injectable()
export class FilesService {
    async createFile(file: Express.Multer.File): Promise<string> {
        const filename = uuid.v4() + '.jpg';
        const filePath = path.join(__dirname, '..', '..', 'static');
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true })
        }
        fs.writeFileSync(path.join(filePath, filename), file.buffer)
        return filename;
    }

    async createFiles(files: Express.Multer.File[]): Promise<string[]> {
        const filenames: string[] = [];
        for (const file of files) {
            filenames.push(await this.createFile(file))
        }

        return filenames;
    }

    async deleteFile(filename: string) {
        const filePath = path.join(__dirname, '..', '..', 'static');
        fs.rmSync(path.join(filePath, filename));
    }
}
