export interface IProcurements {
    procurementRequestId: string;
    vendorList: string[];
    categoryList: string[];
    requestID: string;
    requestNumber: string;
    requestRaisedOn: Date;
    purchaseRequestNumber: string;
    networkCompanyId?: string;
    networkCompany?: string;
    purpose: string;
    status: string;
    comments: string;
    notes: string;
    active: boolean;
    approvedBy: string;
    submittedBy: string;
    createdBy: string;
    submittedOn: Date;
    approvedOn: Date;
    quoteReceivedOn: Date;
    createdOn: Date;
    poGeneratedOn: Date;
    vendorNameList: string[];
    quoteReceivedOnList: string[];
    vendors: IQuoteVendors[];
    purchaseOrderNumberList: string[];
    poGeneratedOnList: string[];
    purchaseOrders: IPoDates[];
}

export interface IPoDates {
    purchaseOrderNumber: string;
    poDate: Date;
}

export interface IQuoteVendors {
    procurementVendorId: string;
    procurementRequestId: string;
    vendorId?: string;
    vendorName?: string;
    quoteReceivedOn?: Date;
    isShortListed?: boolean;
    qutoeFilePath?: string;
    quoteFile?: File | null;
    fileName?: string;
}

export type ProcurementProps = {
    id: number | string;
    vendorList: string[];
    categoryId: string;
    manfacturerId: string;
    modelNumber: string;
    specifications: string;
    quantity: string;
    networkCompanyId: string;
    ratePerQuantity: string;
    vendorId?: string;
    vendorName?: string;
    categoryName?: string;
    manufacturerName?: string;
    notes?: string;
};
