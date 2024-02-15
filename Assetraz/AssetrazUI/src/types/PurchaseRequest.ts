interface IPurchaseRequest {
  requestID: string;
  purchaseRequestNumber: string;
  networkCompanyId: string;
  purpose: string;
  status: string;
  comments: string;
  active: boolean;
  approverName: string;
  approvedBy: string;
  iTRequestNumber?: string;
  requestNumber: string;
  requestRaisedOn: Date;
  approvedOn?: Date;
  priority: string;
  categoryId: string;
  categoryName: string;
  associateName: string;
  createdDate: Date;
  inventoryId?: string;
}

export default IPurchaseRequest;