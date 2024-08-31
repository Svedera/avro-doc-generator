export abstract class AbstractFileHandler {
    abstract getFilePaths(
        source: string,
        extensions: string[]): Promise<string[]>;
    abstract loadFile(
        filePath: string,
        encoding: BufferEncoding): string | null;
    abstract loadFiles(
        sourceFolder: string,
        extensions: string[],
        encoding: BufferEncoding): string[];
    abstract saveFile(
        destinationFolder: string,
        fileName: string,
        fileContent: string): boolean;
}