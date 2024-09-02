import { AbstractAvroParser } from '@interfaces/avro-parser';
import { AbstractFileHandler } from '@interfaces/file-handler';
import { AbstractHtmlGenerator } from '@interfaces/html-generator';
import { AbstractLogging } from '@interfaces/logging';
import { CliArguments } from '@models/arguments';
import { AvroSchema, AvroSchemaView } from '@models/avro';

export class DocumentationGenerator {
    // TODO: pass as a param to method to make more generic
    // Better to create generator model with generation service,
    // parser service and other generation configs
    readonly avroFileExtensions = ['.avsc', '.json'];

    constructor(
        private logging: AbstractLogging,
        private fileHandler: AbstractFileHandler,
        private avroParser: AbstractAvroParser,
        private htmlGenerator: AbstractHtmlGenerator<AvroSchema>) {

    }

    async generateHtml(args: CliArguments) {
        const schemaFiles = await this.fileHandler.getFilePaths(
            args.input,
            this.avroFileExtensions);
        const parsedSchemas = this.getParsedSchemas(schemaFiles);
        const html = this.htmlGenerator.generate(parsedSchemas);
        this.fileHandler.saveFile(args.output, html);
    }

    private getParsedSchemas = (schemaFiles: string[]): AvroSchemaView[] => {
        const parsedSchemas: AvroSchemaView[] = [];

        schemaFiles.forEach(schemaPath => {
            const schemaContent =
                this.fileHandler.loadFile(schemaPath, 'utf-8');

            if (schemaContent == null) {
                // TODO: add custom error
                throw new Error(
                    `Could not load file content for ${schemaPath}`);
            }

            try {
                const parsedSchema = this.avroParser.parse(schemaContent);
                const view = this.avroParser.convertToView(parsedSchema);
                parsedSchemas.push(view);
            } catch (error) {
                // TODO: add custom error
                const errorMessage = (error as Error).message;
                throw Error(
                    `Could not parse schema ${schemaPath}\n${errorMessage}`);
            }
        });

        return parsedSchemas;
    }
}