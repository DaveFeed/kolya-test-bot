import { Logger as PinoLogger } from 'pino';
import { Scenes, Telegraf, Telegram } from 'telegraf';

import { Logger } from 'src/libraries/logger';

import { ITelegram as Config } from 'src/configs/interfaces';
import { Context, IScene, AvailableScenes } from 'src/scenes/interfaces';
import { IRepositories } from 'src/repositories/interfaces';
import { formatDate } from 'src/libraries/utils';
import { User } from 'src/domain/dto';

const { enter } = Scenes.Stage;

export class SettingsScene extends Scenes.BaseScene<Context> implements IScene {
    public static readonly id = 'settings';

    public readonly sceneList: AvailableScenes[] = ['main'];

    private readonly config: Config;

    private readonly repositories: IRepositories;

    private readonly log: PinoLogger;

    private readonly buttons = {
        rename: 'Изменить имя',
        myStats: 'Мои балы',
        myTests: 'Мои тесты',
        turnOff: 'Отключить тесты',
        turnOn: 'Включить тесты',
        back: 'Назад'
    };

    constructor(config: Config, logger: Logger, repositories: IRepositories) {
        super(SettingsScene.id);
        this.config = config;
        this.repositories = repositories;

        this.log = logger.getLogger('settings-scene');

        // todo:: (check) this.use is not setting up middleware properly

        this.enter(this.startHandler.bind(this));
        this.hears(this.buttons.back, enter<Context>('main'));

        this.hears(this.buttons.rename, this.renameHandler.bind(this));
        this.hears(this.buttons.myStats, this.myStatsHandler.bind(this));
        this.hears(this.buttons.myTests, this.myTestsHandler.bind(this));
        this.hears(this.buttons.turnOn, this.turnOnHandler.bind(this));
        this.hears(this.buttons.turnOff, this.turnOffHandler.bind(this));

        this.hears(this.buttons.back, (ctx) => {
            ctx.scene.enter('main');
        });

        // this.on('message', this.onMessage.bind(this));
    }

    private async startHandler(ctx: Context): Promise<void> {
        try {
            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || !user.isUnlocked) return;

            const data = this.getUserDataWithKeyboard(user);
            const message = await ctx.reply(data.text, {
                reply_markup: {
                    keyboard: data.keyboard,
                    resize_keyboard: true
                }
            });

            await this.repositories.messages.set(`${ctx.from?.id}.settings_id`, message.message_id);
        } catch (e) {
            this.log.error(e);
        }
    }

    private async renameHandler(ctx: Context): Promise<void> {
        try {
            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || !user.isUnlocked) return;

            await this.repositories.users.set(`${ctx.from?.id}.isUnlocked`, false);
            ctx.scene.enter('main');
        } catch (e) {
            this.log.error(e);
        }
    }

    private async myStatsHandler(ctx: Context): Promise<void> {
        try {
            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || !user.isUnlocked) return;

            ctx.reply('Будет добавлено после добавления статистики');
        } catch (e) {
            this.log.error(e);
        }
    }

    private async myTestsHandler(ctx: Context): Promise<void> {
        try {
            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || !user.isUnlocked) return;

            ctx.reply('Будет добавлено после добавления тестов');
        } catch (e) {
            this.log.error(e);
        }
    }

    private async turnOnHandler(ctx: Context): Promise<void> {
        try {
            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || !user.isUnlocked || !user.turnedOffAt) return;

            await this.repositories.users.delete(`${ctx.from?.id}.turnedOffAt`);

            // this.updateMessage(ctx, user);
            ctx.scene.reenter();
        } catch (e) {
            this.log.error(e);
        }
    }

    private async turnOffHandler(ctx: Context): Promise<void> {
        try {
            const user = await this.repositories.users.get(`${ctx.from?.id}`);

            if (!user || !user.isUnlocked || user.turnedOffAt) return;

            await this.repositories.users.set(`${ctx.from?.id}.turnedOffAt`, new Date());

            // this.updateMessage(ctx, user);
            ctx.scene.reenter();
        } catch (e) {
            this.log.error(e);
        }
    }

    private getUserDataWithKeyboard(user?: User) {
        return {
            text: `Ваши текущие настройки:\
            \nИмя: ${user?.realName || ''}\
            \nНик: @${user?.username}\
            \nПрисоединились: ${formatDate(new Date(user?.createdAt || 0))}\
            \nУведомления: ${user?.turnedOffAt ? `отключены` : `включены`}`,
            keyboard: [
                [this.buttons.rename],
                [this.buttons.myStats, this.buttons.myTests],
                [user?.turnedOffAt ? this.buttons.turnOn : this.buttons.turnOff],
                [this.buttons.back]
            ]
        };
    }

    // private async updateMessage(ctx: Context, user: User) {
    //     const messages = await this.repositories.messages.get(`${ctx.from?.id}`);

    //     if (!messages?.settings_id) {
    //         this.startHandler(ctx);
    //         return;
    //     }

    //     const data = this.getUserDataWithKeyboard(user);

    //     const message = await ctx.telegram.editMessageText(ctx.chat?.id, messages?.settings_id, undefined, data.text, {
    //         reply_markup: {
    //             keyboard: data.keyboard,
    //             resize_keyboard: true
    //         }
    //     });
    // }
}
