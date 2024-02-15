export type Invoice = {
  purchaseOrderRequestId?:string;
  invetoryId?:String;
  invoiceNumber:string;
  invoiceDate:Date;
  invoiceFilePath: string;
  invoiceFile: Blob | null;
  fileName: string;
  isHandedOver:boolean;
}

export type PurchaseItemsDetails = {
  purchaseOrderRequestId: string;
  categoryName: string;
  procurementRequestId: string;
  categoryId: string;
  manufacturerId: string;
  vendorId: string;
  manufacturerName: string;
  modelNumber: string;
  specifications: string;
  quantity: number;
  ratePerQuantity: number;
  quantityReceived: number;
  amount: number;
  totalOrderValue?: number;
  purchaseOrderDetailsId?: string;
  procurementDetailsId?: string;
}

export type PurchaseDetails = {
  requestNumber: string;
  procurementRequestId: string;
  vendorId: string;
  purchaseOrderNumber: string;
  purchaseOrderRequestId: string;
  procurementVendorId: string;
  networkCompanyName:string;
  quoteFileName: string;
  invoiceFileName: string;
  requestRaisedOn: Date;
  quoteReceivedOn: Date;
  approvedOn: Date;
  approvedBy: string;
  vendorName: string;
  poDate: Date;
  invoiceNumber: string;
  invoiceDate: Date;
  isHandedOver: boolean;
  invoiceId:string;
  comments?: string;
  notes?: string;
  purchaseOrderDetailsId?: string;
}