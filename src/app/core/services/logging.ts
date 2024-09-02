import { LogLevel } from '@enums/log-level';
import { AbstractLogging } from '@interfaces/logging';
import { Configuration } from '@models/configuration';

export class Logging implements AbstractLogging {

    constructor(private configuration: Configuration) { }

    trace = (message: string, source?: string) =>
        this.log(message, LogLevel.Trace, source);
    debug = (message: string, source?: string) =>
        this.log(message, LogLevel.Debug, source);
    info = (message: string, source?: string) =>
        this.log(message, LogLevel.Information, source);
    warn = (message: string, source?: string) =>
        this.log(message, LogLevel.Warning, source);
    error = (message: string, source?: string, error?: Error) =>
        this.logError(message, LogLevel.Error, error, source);
    fatal = (message: string, source?: string, error?: Error) =>
        this.logError(message, LogLevel.Critical, error, source);

    private log(
        message: string,
        level: LogLevel,
        source?: string) {

        if (level < this.configuration.logLevel) {
            return;
        }
        this.logToConsole(message, level, source);
    }

    private logError(
        message: string,
        level: LogLevel,
        error?: Error,
        source?: string) {

        if (level < this.configuration.logLevel) {
            return;
        }
        this.logToConsole(message, level, source, error);
    }

    private logToConsole = (
        message: string,
        level: LogLevel,
        source?: string,
        error?: Error) => {

        if (level < this.configuration.logLevel) {
            return;
        }

        const utcTimestamp: string = new Date().toISOString();
        let messageToLog: string | null = null;
        if (source) {
            messageToLog = `[${utcTimestamp}] [${source}] ${message}`;
        } else {
            messageToLog = `[${utcTimestamp}] ${message}`;
        }

        switch (level) {
            /* eslint-disable no-console */
            case LogLevel.Trace: return console.trace(messageToLog);
            case LogLevel.Debug: return console.debug(messageToLog);
            case LogLevel.Information: return console.info(messageToLog);
            case LogLevel.Warning: return console.warn(messageToLog);
            case LogLevel.Error:
            case LogLevel.Critical:
                console.error(messageToLog);
                if (error) {
                    console.error(error);
                }
                return;
            case LogLevel.None: return;
            default: return console.log(messageToLog);
            /* eslint-enable no-console */
        }
    };
}