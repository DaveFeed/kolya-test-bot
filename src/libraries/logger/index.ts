import pino, { LoggerOptions, Logger as PinoLogger } from 'pino';
import prettyStream from 'pino-pretty';
// import dateformat from 'dateformat';

import { Logger as LoggerInterface } from 'src/libraries/logger/types';

export class Logger implements LoggerInterface {
    getLogger(module?: string): PinoLogger {
        const options: LoggerOptions = {
            mixin: (): { module: string } => ({
                module: module || 'main'
            }),
            base: null,
            timestamp: (): string => `,"time":"${new Date().toISOString()}"`
        };

        const instance = pino(
            options,
            prettyStream({
                colorize: true,
                ignore: 'pid,hostname',
                timestampKey: 'time',
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                singleLine: false
            })
        );

        return instance;
    }
}
