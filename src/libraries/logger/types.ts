import { Logger as PinoLogger } from 'pino';

export interface Logger {
    getLogger(module?: string): PinoLogger;
}
