import { promises as fsPromises } from 'fs';

import { SourceType } from '@enums/path-type';
import { SourceProcessingError } from '@shared/exceptions/file';


export async function sourceType(path: string): Promise<SourceType> {
    try {
        const stats = await fsPromises.stat(path);

        if (stats.isFile()) {
            return SourceType.File;
        } else if (stats.isDirectory()) {
            return SourceType.Folder;
        }
        return SourceType.Unknown;
    } catch (error) {
        throw new SourceProcessingError(path, error as Error)
    }
}