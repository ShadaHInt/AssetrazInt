interface IStockReceiptDocument {
  invoiceId: string;
  purchaseOrderNumber: string;
  requestRaisedOn: Date;
  invoiceNumber: string;
  invoiceDate: Date;
  updatedDate: Date;
  updatedBy: string;
  invoiceUploadedBy: string;
  vendorName: string;
  categoryList: string[];
  status?: string;
  networkCompanyName?: string;
}

export default IStockReceiptDocument;