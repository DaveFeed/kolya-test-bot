import { Scenes } from 'telegraf';
import { Logger as PinoLogger } from 'pino';

import { MainScene } from 'src/scenes/main/index';
import { Context, IScenes, IScene } from 'src/scenes/interfaces';

import { ITelegram as Config } from 'src/configs/interfaces';
import { Logger } from 'src/libraries/logger';
import { IRepositories } from 'src/repositories/interfaces';

export class Stage {
    private readonly stage: Scenes.Stage<Context>;

    private readonly log: PinoLogger;

    private readonly config: Config;

    private readonly scenes: IScenes;

    constructor(logger: Logger, config: Config, repositories: IRepositories) {
        this.config = config;
        this.log = logger.getLogger('scenes');
        this.log.info({}, 'setting up stage: constructor');

        this.scenes = {
            main: new MainScene(config, logger, repositories)
        };

        this.checkScenesMismatch();
        const options = {
            default: config.sceneDefault || undefined
        };

        if (!Object.keys(this.scenes).includes(this.config.sceneDefault)) {
            options.default = undefined;

            this.log.info({}, `Couldn't resolve sceneDefault in config, default is undefined`);
        }

        this.stage = new Scenes.Stage<Context>(Object.values(this.scenes), options);

        this.log.info({}, 'stage is ready: constructor');
    }

    public get getStage(): Scenes.Stage<Context> {
        return this.stage;
    }

    private checkScenesMismatch() {
        let problemExists = false;
        const names: string[] = Object.keys(this.scenes);
        const scenes: IScene[] = Object.values(this.scenes);
        const notFoundScenes: string[] = [];

        scenes.forEach((scene) => {
            scene.sceneList.forEach((name) => {
                if (!names.includes(name)) {
                    this.log.error(`Scene "${name}" doesn't exist in the list: constructor`);
                    notFoundScenes.push(name);
                    problemExists = true;
                }
            });
        });

        if (problemExists) {
            this.log.info({ list: names, notFound: notFoundScenes }, 'Scene information for debug');
            throw new Error();
        }
    }
}
