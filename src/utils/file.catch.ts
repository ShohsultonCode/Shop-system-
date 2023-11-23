import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { imageFileFilter } from './filter.file';

export function fileUploadInterceptor(fieldName: string) {
    return FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueFileName = uuidv4() + extname(file.originalname);
                cb(null, uniqueFileName);
            },
        }),
        fileFilter: imageFileFilter

    });
}

