export type UserRequest = {
    requestID: string;
    requestNumber: string;
    requestRaisedOn: Date;
    purchaseRequestNumber: string;
    networkCompanyId: string;
    networkCompanyName: string;
    purpose: string;
    status: string;
    comments: string;
    active: boolean;
    approvedBy: string;
    approverName: string;
    submittedBy: string;
    createdBy: string;
    submittedOn: Date;
    approvedOn: Date;
    associateName: string;
    priority: string;
    categoryId: string;
    categoryName: string;
};