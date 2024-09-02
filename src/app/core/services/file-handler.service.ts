import 'reflect-metadata';

import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    writeFileSync,
    statSync
} from 'fs';
import { extname, join } from 'path';

import { singleton } from 'tsyringe';

import { AbstractFileHandler } from '@interfaces/file-handler';
import { AbstractLogging } from '@interfaces/logging';
import { SourceType } from '@enums/path-type';
import {
    SourceProcessingError,
    UnknownSourceTypeError
} from '@shared/exceptions/file';

@singleton()
export class FileHandler implements AbstractFileHandler {

    constructor(private logger: AbstractLogging) { }

    getFilePaths(
        source: string,
        extensions: string[]): string[] {

        const exist = existsSync(source);
        if (!exist) {
            // TODO: Create proper error
            throw new Error(`Input source does not exist by path: ${source}`)
        }

        const type = this.sourceType(source);
        switch (type) {
            case SourceType.File:
                this.logger.debug(`Source path "${source}" is a file`);
                const isCorrectExecution =
                    this.isValidExtensions(source, extensions);
                if (!isCorrectExecution) {
                    // TODO: create specific error
                    throw Error('Incorrect file extension');
                }
                return [source];

            case SourceType.Folder:
                this.logger.debug('Source path is a folder');
                return this.getFilePathsFromFolder(source, extensions);

            case SourceType.Unknown:
                throw new UnknownSourceTypeError(source);
        }
    }

    loadFile(
        filePath: string,
        encoding: BufferEncoding = 'utf-8'): string | null {
        this.logger.trace(`Reading file "${filePath}" from filesystem...`);
        try {
            const rawData = readFileSync(filePath, encoding);
            return rawData;
        } catch (exception) {
            // TODO: handle possible issues
            throw new Error(`Failed to load file ${filePath} \n${exception}`)
        }
    }

    loadFiles(sourceFolder: string,
        extensions: string[],
        encoding: BufferEncoding = 'utf-8'): string[] {

        const files = readdirSync(sourceFolder, encoding)
            .filter(file => this.isValidExtensions(file, extensions));
        return files;
    }

    saveFile(
        destinationPath: string,
        fileContent: string): boolean {
        try {
            writeFileSync(destinationPath, fileContent);
        } catch (exception) {
            // TODO: make proper error
            const errorMessage = (exception as Error).message;
            throw new Error(`Could not save file.\n${errorMessage}`)

        }
        return true;
    }

    // TODO: make async
    private getFilePathsFromFolder = (
        folder: string,
        extensions: string[] | null): string[] => {

        const selectedFiles: string[] = [];

        const files = readdirSync(
            folder,
            {
                withFileTypes: true,
                recursive: true
            }
        );
        for (const file of files) {
            const isValidExtension =
                this.isValidExtensions(file.name, extensions);
            if (isValidExtension) {
                const filePath = join(file.parentPath, file.name);
                selectedFiles.push(filePath);
            }
        }

        return selectedFiles;
    }

    private isValidExtensions =
        (file: string, extensions: string[] | null
        ): boolean => {
            if (extensions == null) {
                return true;
            }
            const extension = extname(file).toLowerCase();
            const isValidExtension = extensions.find(validExtension =>
                validExtension.toLocaleLowerCase() === extension);
            return isValidExtension != null;
        };


    sourceType(path: string): SourceType {
        try {
            const stats = statSync(path);

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
}