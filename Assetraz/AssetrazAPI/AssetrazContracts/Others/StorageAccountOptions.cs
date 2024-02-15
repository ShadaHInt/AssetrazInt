namespace AssetrazContracts.Others
{
    public class StorageAccountOptions
    {
        public string VendorQuoteContainer { get; set; } 
        public string PurchaseOrderContainer { get; set; } 
        public string InvoiceContainer { get; set; }
        public string InsuranceContainer { get; set; }
        public string InventoryDocumentContainer { get; set; }
        public string Name { get; set; }
        public string AccessKey { get; set; }
    }

    public enum StorageAccountContainer
    {
        Quotes,
        PurchaseOrders,
        Invoices,
        Insurance,
        InventoryDocument
    }
}
