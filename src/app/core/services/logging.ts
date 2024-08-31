import { LogLevel } from '@enums/log-level';
import { AbstractLogging } from '@interfaces/logging';
import { Configuration } from '@models/configuration';

export class Logging implements AbstractLogging {

    constructor(private configuration: Configuration) { }

    trace = (message: string) => this.log(message, LogLevel.Trace);
    debug = (message: string) => this.log(message, LogLevel.Debug);
    info = (message: string) => this.log(message, LogLevel.Information);
    warn = (message: string) => this.log(message, LogLevel.Warning);
    error = (message: string, error?: Error) =>
        this.log(message, LogLevel.Error, error);
    fatal = (message: string, error?: Error) =>
        this.log(message, LogLevel.Critical, error);

    private log(message: string, level: LogLevel, error?: Error) {
        if (level < this.configuration.logLevel) {
            return;
        }
        this.logToConsole(message, level, error);
    }

    private logToConsole = (
        message: string,
        level: LogLevel,
        error?: Error) => {

        if (level < this.configuration.logLevel) {
            return;
        }

        switch (level) {
            /* eslint-disable no-console */
            case LogLevel.Trace: return console.trace(message);
            case LogLevel.Debug: return console.debug(message);
            case LogLevel.Information: return console.info(message);
            case LogLevel.Warning: return console.warn(message);
            case LogLevel.Error:
            case LogLevel.Critical:
                console.error(message);
                if (error) {
                    console.error(error);
                }
                return;
            case LogLevel.None: return;
            default: return console.log(message);
            /* eslint-enable no-console */
        }
    };
}