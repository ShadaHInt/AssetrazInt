export type Category = {
    categoryId: string;
    categoryName: string;
};

export interface ICategory {
    categoryId: string;
    categoryName: string;
    unitOfMeasurement: string;
    issuable: boolean;
    createdDate: Date;
    createdBy: string;
    updatedDate: Date;
    updatedBy: string;
    warrantyRequired: boolean;
    serialNumberRequired: boolean;
    assetTagRequired: boolean;
    active: boolean;
}

export interface ICategoryModal {
    dismissPanel: (value: boolean, message?: string) => void;
    categorySelected: any;
}
