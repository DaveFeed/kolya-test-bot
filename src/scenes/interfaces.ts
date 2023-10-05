import { Scenes } from 'telegraf';

export type Context = Scenes.SceneContext;
export type BaseScene = Scenes.BaseScene<Context>;

export interface IScenes {
    main: BaseScene;
}

export type AvailableScenes = keyof IScenes;

export interface IScene {
    readonly id: string;
    readonly sceneList: AvailableScenes[];
}
