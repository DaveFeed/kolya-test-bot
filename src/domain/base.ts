export interface BaseModule {
    init(): Promise<void>;

    start(): Promise<void>;

    stop(): Promise<void>;
}
