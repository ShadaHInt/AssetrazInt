export interface IDocument {
  key: string;
  name: string;
  categoryName: string;
  manufacturerName: string;
  modelNumber: string;
  serialNumber: string;
  assetTagNumber: string;
  warrentyDate: string;
  assetStatus: string;
  emailId: string;
  issuedDate: string;
  inventoryId: string;
  returnDate: Date;
  Reason: string;
}

export interface IRequestDocument {
  key: string;
  name: string;
  requestID: string;
  requestNumber: string;
  purchaseRequestNumber: string;
  networkCompanyId: string;
  companyName: string;
  purpose: string;
  status: string;
  comments: string;
  active: boolean;
  approvedBy: string;
  approverName: string;
  iTRequestNumber: string;
  priority: string;
  categoryId: string;
  categoryName: string;
}

export interface IDetailsListBasicExampleState {
  assetItems: IDocument[];
  requestItems: IRequestDocument[];
  selectionDetails: string;
}

export interface Props {
  email: string;
}