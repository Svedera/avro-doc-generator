import { AbstractAvroParser } from '@interfaces/avro-parser';
import { AbstractFileHandler } from '@interfaces/file-handler';
import { AbstractLogging } from '@interfaces/logging';
import { CliArguments } from '@models/arguments';

export class DocumentationGenerator {
    readonly avroFileExtensions = ['.avsc', '.avro.json'];

    constructor(
        private logging: AbstractLogging,
        private fileHandler: AbstractFileHandler,
        private avroParser: AbstractAvroParser) {

    }

    generateHtml(args: CliArguments) {
        const schemas = this.fileHandler.getFilePaths(
            args.input,
            this.avroFileExtensions);

        // TODO: check if empty
    }
}