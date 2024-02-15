CREATE TABLE [dbo].[Invoices] (
    [InvoiceID]                 UNIQUEIDENTIFIER NOT NULL,
    [PurchaseOrderRequestID]    UNIQUEIDENTIFIER NULL,
    [InventoryID]               UNIQUEIDENTIFIER NULL, 
    [ReferenceNumber]           UNIQUEIDENTIFIER NULL, 
    [InvoiceNumber]             VARCHAR (50)     NULL,
    [InvoiceDate]               DATETIME         NULL,
    [InvoiceFilePath]           VARCHAR (1000)   NULL,
    [InvoiceUploadedOn]         DATETIME         NULL,
    [InvoiceUploadedBy]         VARCHAR (200)    NULL,
    [IsHandedOver]              BIT              NOT NULL,
    [IsAssetAddedToInventory]   BIT DEFAULT 0    NOT NULL,
    [CreatedDate]               DATETIME         NOT NULL,
    [CreatedBy]                 VARCHAR (200)    NOT NULL,
    [UpdatedDate]               DATETIME         NOT NULL,
    [UpdatedBy]                 VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_Invoices]    PRIMARY KEY CLUSTERED ([InvoiceID] ASC),
    CONSTRAINT [FK_Invoices_PurchaseOrderHeaders] FOREIGN KEY ([PurchaseOrderRequestID]) REFERENCES [dbo].[PurchaseOrderHeaders] ([PurchaseOrderRequestID])
);

