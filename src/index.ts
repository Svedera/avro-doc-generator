#! /usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { CliArguments } from '@models/arguments';
import { initGenerator } from '@services/container';

const resolveArgs = (): CliArguments => {
  const args = yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      type: 'string',
      description: 'Path to a source schema file or folder',
      demandOption: true
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      description: 'Output file path',
      default: './documentation.html'
    })
    .argv as CliArguments;
  return args;
}

try {
  const args = resolveArgs();
  // TODO: use logger
  // eslint-disable-next-line no-console
  console.log(`Source path: ${args.input}\nOutput path: ${args.output}`);
  const generator = initGenerator();
  const html = generator.generateHtml(args);
} catch (exception) {
  // TODO: use logger
  // eslint-disable-next-line no-console
  console.error(exception);
}