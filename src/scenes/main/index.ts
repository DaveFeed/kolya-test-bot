import { Logger as PinoLogger } from 'pino';
import { Scenes } from 'telegraf';

import { Logger } from 'src/libraries/logger';

import { ITelegram as Config } from 'src/configs/interfaces';
import { Context, IScene, AvailableScenes } from 'src/scenes/interfaces';
import { IRepositories } from 'src/repositories/interfaces';

const { enter } = Scenes.Stage;

export class MainScene extends Scenes.BaseScene<Context> implements IScene {
    public static readonly id = 'main';

    public readonly sceneList: AvailableScenes[] = ['main', 'settings'];

    private readonly config: Config;

    private readonly repositories: IRepositories;

    private readonly log: PinoLogger;

    private readonly buttons = {
        stats: 'Статистика',
        start: 'Старт',
        settings: 'Настройки',
        admin: 'Админ меню',
        back: 'Назад'
    };

    constructor(config: Config, logger: Logger, repositories: IRepositories) {
        super(MainScene.id);
        this.config = config;
        this.repositories = repositories;

        this.log = logger.getLogger('main-scene');

        this.start(this.startHandler.bind(this));
        this.enter(this.startHandler.bind(this));
        this.hears(this.buttons.back, this.startHandler.bind(this));
        this.hears(this.buttons.start, this.startHandler.bind(this));

        this.hears(this.buttons.settings, enter<Context>('settings'));
        this.hears(this.buttons.stats, this.statsHandler.bind(this));

        this.hears(this.buttons.back, (ctx) => {
            ctx.scene.enter('main');
        });

        this.on('message', this.onMessage.bind(this));
    }

    private async isUnlocked(ctx: Context): Promise<boolean> {
        if (
            // for testing: this.config.admins.includes(ctx.from?.id as number) ||
            await this.repositories.users.get(`${ctx.from?.id}.isUnlocked`)
        ) {
            return true;
        }

        return false;
    }

    private async startHandler(ctx: Context): Promise<void> {
        try {
            if (!(await this.isUnlocked(ctx))) {
                ctx.reply(`Для начала использования введите свое имя`, {
                    reply_markup: { remove_keyboard: true }
                });
                await this.repositories.users.set(`${ctx.from?.id}.isUnlocked`, false);
                return;
            }

            const layout = [[this.buttons.stats], [this.buttons.settings]];

            if (this.config.admins.includes(ctx.from?.id as number)) {
                layout.push([this.buttons.admin]);
            }

            ctx.reply(
                `Приветствую: ${await this.repositories.users.get(
                    `${ctx.from?.id}.realName`
                )}\nЭто начальное меню бота, это пруф концепта, так что многое может не работать.\
                \nСпасибо за помощь, тестирование и ваш фидбек <3`,
                {
                    reply_markup: {
                        keyboard: layout,
                        resize_keyboard: true
                    }
                }
            );
        } catch (e) {
            this.log.error(e);
        }
    }

    private async onMessage(ctx: Context): Promise<void> {
        try {
            if (await this.isUnlocked(ctx)) {
                return;
            }

            const { text } = ctx.message as unknown as { text: string };

            if (!text) return;

            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || user?.isUnlocked !== false) return;

            const nameRegex = /^[a-zA-Z\u0400-\u04FF\u0531-\u0587]{1,20} [a-zA-Z\u0400-\u04FF\u0531-\u0587]{1,20}$/;
            if (!nameRegex.test(text)) {
                ctx.reply(
                    `Имя должно быть написано на одной строке, русскими, английскими или армянскими буквами.\nФормат: Имя Фамилия\nДлина слов 20 букв.`,
                    { reply_markup: { remove_keyboard: true } }
                );
                return;
            }

            await this.repositories.users.set(`${ctx.from?.id}.realName`, text);
            await this.repositories.users.set(`${ctx.from?.id}.isUnlocked`, true);

            await ctx.reply(`Добро пожаловать: ${text}`);

            // todo:: (check) problem with reenter
            ctx.scene.enter(MainScene.id);
        } catch (e) {
            this.log.error(e);
        }
    }

    private async statsHandler(ctx: Context): Promise<void> {
        try {
            ctx.reply('Будет добавлено после тестов');
        } catch (e) {
            this.log.error(e);
        }
    }
}
