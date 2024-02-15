export interface IInsuredAsset {
    insuranceReferenceId: string;
    referenceNumber: string;
    purchaseOrderNumber: string;
    invoiceNumber: string;
    categoryName: string;
    manufacturerName: string;
    modelNumber: string;
    warrentyDate: string;
    serialNumber: string;
    assetValue: string;
    status: string;
    pogeneratedOn: string;
    invoiceDate: string;
    assetTagNumber: string;
    quantity: string;
    insuranceOffice: string;
    policyNumber: string;
    policyStartDate: string;
    policyEndDate: string;
    policyFilePath: string;
    networkCompanyName: string;
}

export interface IInsuredAssetModalType {
    selectedReferenceIds?: string[] | any;
    referenceId: string;
    referenceNumber: string;
    dismissPanel: (isSuccess?: boolean) => any;
    isModalOpen: boolean;
}

export type InsuredAssetRequest = {
    insuranceReferenceId?: string;
    referenceNumber?: string;
    purchaseOrderNumber?: string;
    invoiceNumber?: string;
    categoryName?: string;
    manufacturerName?: string;
    modelNumber?: string;
    warrentyDate?: string;
    serialNumber?: string;
    assetValue?: string;
    status?: string;
    pogeneratedOn?: string;
    invoiceDate?: string;
    assetTagNumber?: string;
    quantity?: string;
    insuranceOffice?: string;
    policyNumber?: string;
    policyStartDate?: string;
    policyEndDate?: string;
    policyFilePath?: string;
    policyFileName?: string;
};

export type EditInsuredAsset = {
    insuranceReferenceId: string;
    policyNumber: string;
    policyStartDate: string;
    policyEndDate: string;
    insuranceOffice: string;
    status: string;
};

export interface IUploadPolicy {
    referenceNumber: string;
    policyFilePath?: string | any;
    policyFile?: Blob | null;
    policyFileName?: string | any;
}
