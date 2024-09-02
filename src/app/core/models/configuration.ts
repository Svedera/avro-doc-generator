import { LogLevel } from '@enums/log-level';

export class Configuration {
    logLevel: LogLevel;

    constructor(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }
}

export const DefaultConfiguration = (): Configuration => ({
    logLevel: LogLevel.Information
})