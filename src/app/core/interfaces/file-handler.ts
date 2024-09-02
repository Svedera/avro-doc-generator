export abstract class AbstractFileHandler {
    abstract getFilePaths(
        source: string,
        extensions: string[]): string[];
    abstract loadFile(
        filePath: string,
        encoding: BufferEncoding): string | null;
    abstract loadFiles(
        sourceFolder: string,
        extensions: string[],
        encoding: BufferEncoding): string[];
    abstract saveFile(
        destination: string,
        fileContent: string): boolean;
}