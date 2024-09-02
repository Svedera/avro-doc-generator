export abstract class AbstractLogging {
    abstract trace(message: string, source?: string): void;
    abstract debug(message: string, source?: string): void;
    abstract info(message: string, source?: string): void;
    abstract warn(message: string, source?: string): void;
    abstract error(message: string, source?: string, error?: Error): void;
    abstract fatal(message: string, source?: string, error?: Error): void;
}