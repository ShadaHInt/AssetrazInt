CREATE TABLE [dbo].[PurchaseOrderHeaders] (
    [PurchaseOrderRequestID] UNIQUEIDENTIFIER NOT NULL,
    [PurchaseOrderNumber]    VARCHAR (20)     NULL UNIQUE,
    [NetworkCompanyID]       UNIQUEIDENTIFIER NOT NULL,
    [RequestRaisedOn]        DATETIME         NULL,
    [RequestRaisedBy]        VARCHAR (200)    NULL,
    [VendorID]               UNIQUEIDENTIFIER NOT NULL,
    [ProcurementRequestID]   UNIQUEIDENTIFIER NOT NULL,
    [CreatedDate]            DATETIME         NOT NULL,
    [CreatedBy]              VARCHAR (200)    NOT NULL,
    [UpdatedDate]            DATETIME         NOT NULL,
    [UpdatedBy]              VARCHAR (200)    NOT NULL,
    [POGeneratedOn]          DATETIME         NULL, 
    CONSTRAINT [PK_PurchaseOrderHeaders] PRIMARY KEY CLUSTERED ([PurchaseOrderRequestID] ASC),
    CONSTRAINT [FK_PurchaseOrderHeaders_NetworkCompanies] FOREIGN KEY ([NetworkCompanyID]) REFERENCES [dbo].[NetworkCompanies] ([NetworkCompanyID]),
    CONSTRAINT [FK_PurchaseOrderHeaders_RequestForQuoteHeaders] FOREIGN KEY ([ProcurementRequestID]) REFERENCES [dbo].[RequestForQuoteHeaders] ([ProcurementRequestID]),
    CONSTRAINT [FK_PurchaseOrderHeaders_Vendors] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendors] ([VendorID])
);

