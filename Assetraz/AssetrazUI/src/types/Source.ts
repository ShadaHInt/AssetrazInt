export type Source = {
    sourceId: string;
    sourceName: string;
};

export interface ISource {
    sourceId: string;
    sourceName: string;
    active: boolean;
}

export interface ISourceModal {
    dismissPanel: (value: boolean, message?: string) => void;
    sourceSelected: any;
}
