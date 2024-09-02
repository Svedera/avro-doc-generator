import 'reflect-metadata';
import { container } from 'tsyringe';

import { AbstractFileHandler } from '@interfaces/file-handler';
import { FileHandler } from './file-handler.service';
import { AbstractAvroParser } from '@interfaces/avro-parser';
import { AvroParser } from './avro-parser.service';
import { DefaultConfiguration } from '@models/configuration';
import { Logging } from './logging';
import { DocumentationGenerator } from './docs-generator';
import {
    AvroHtmlGeneratorService
} from 'src/app/avro-html-generator/avro-html-generator';

export const registerContainers = () => {
    container.registerSingleton<AbstractFileHandler>(FileHandler);
    container.registerSingleton<AbstractAvroParser>(AvroParser);

}

// TODO: Use container
export const initGenerator = (): DocumentationGenerator => {
    const config = DefaultConfiguration();
    const logging = new Logging(config);
    const fileHandler = new FileHandler(logging);
    const avroParser = new AvroParser(logging);
    const htmlGenerator = new AvroHtmlGeneratorService();
    const docsGenerator = new DocumentationGenerator(
        logging,
        fileHandler,
        avroParser,
        htmlGenerator);
    return docsGenerator;
}