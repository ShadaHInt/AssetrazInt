export interface IIssueReturnModalType {
    inventoryId: string;
    dismissPanel: (isSuccess?: boolean) => any;
    purchaseRequestNumber: string;
    submittedBy: string;
    issuedTo: string;
}

export type AssetIssueReturnRequest = {
    inventoryId: string;
    emailId: string;
    employeeId?: string;
    issuedTo?: string;
    userRequestNumber?: string;
    reason?: string;
    status?: string;
    remarks?: string;
};

export type AssetDetails = {
    purchaseOrderNumber: string;
    invoiceNumber: string;
    invoiceDate: Date;
    requestRaisedOn: Date;
    categoryName: string;
    manufacturerName: string;
    assetTagNumber: string;
    assetValue: number;
    warrentyDate: Date;
    modelNumber: string;
    serialNumber: string;
    issuedTo?: string;
    emailId?: string;
    employeeId?: string;
    userRequestNumber?: string;
};

export const ErrorTypes = {
    ALLREADY_ASSIGNED: 1,
    GENERIC: 2,
};
