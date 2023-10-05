/* eslint-disable no-console */
import 'source-map-support/register';
import './module-alias';
import { Config } from 'src/configs';

import { BotRunner } from 'src/bot';

async function main() {
    const config = new Config();

    const botRunner = new BotRunner(config);

    process.once('SIGTERM', async () => {
        console.log('SIGTERM received: Stopping ...');

        await botRunner.stop();
        process.exit(0);
    });
    process.once('SIGINT', async () => {
        console.log('SIGINT received: Stopping ...');

        await botRunner.stop();
        process.exit(0);
    });

    await botRunner.init();

    return botRunner.start();
}

main().catch(console.error);
