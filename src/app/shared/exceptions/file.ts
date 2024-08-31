import { ErrorCodes as ErrorCode } from './error-codes';

export class SourceProcessingError extends Error {
    public code = ErrorCode.SourceProcessingError;

    constructor(sourcePath: string, originalError: Error) {
        const message = `Could not process input path: "${sourcePath}"`
        super(message);
        this.stack = originalError.stack;
    }
}

export class UnknownSourceTypeError extends Error {
    public code = ErrorCode.UnknownSourceTypeError;

    constructor(sourcePath: string) {
        const message =
            `Could not process input: "${sourcePath}" - unknown source type`;
        super(message);
    }
}

export class FileLoadError extends Error {
    public code = ErrorCode.UnknownSourceTypeError;

    constructor(sourcePath: string) {
        const message =
            `Could not process input: "${sourcePath}" - unknown source type`;
        super(message);
    }
}