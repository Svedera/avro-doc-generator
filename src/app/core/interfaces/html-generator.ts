export abstract class AbstractHtmlGenerator<T> {
    abstract generate(items: T[]): string;
}