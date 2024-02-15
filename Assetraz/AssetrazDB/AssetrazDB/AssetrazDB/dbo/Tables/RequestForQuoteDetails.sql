CREATE TABLE [dbo].[RequestForQuoteDetails] (
    [ProcurementDetailsID] UNIQUEIDENTIFIER NOT NULL,
    [ProcurementRequestID] UNIQUEIDENTIFIER NOT NULL,
    [VendorID]             UNIQUEIDENTIFIER NULL,
    [CategoryID]           UNIQUEIDENTIFIER NOT NULL,
    [ManufacturerID]       UNIQUEIDENTIFIER NULL,
    [ModelNumber]          VARCHAR (100)    NULL,
    [Specifications]       VARCHAR (MAX)    NOT NULL,
    [Quantity]             DECIMAL (18, 2)  NOT NULL,
    [RatePerQuantity]      MONEY            NOT NULL,
    [CreatedDate]          DATETIME         NOT NULL,
    [CreatedBy]            VARCHAR (200)    NOT NULL,
    [UpdatedDate]          DATETIME         NOT NULL,
    [UpdatedBy]            VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_ProcurementDetails] PRIMARY KEY CLUSTERED ([ProcurementDetailsID] ASC),
    CONSTRAINT [FK_ProcurementDetails_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Categories] ([CategoryID]),
    CONSTRAINT [FK_ProcurementDetails_Manufacturers] FOREIGN KEY ([ManufacturerID]) REFERENCES [dbo].[Manufacturers] ([ManfacturerID]),
    CONSTRAINT [FK_ProcurementDetails_ProcurementHeaders] FOREIGN KEY ([ProcurementRequestID]) REFERENCES [dbo].[RequestForQuoteHeaders] ([ProcurementRequestID]),
    CONSTRAINT [FK_RequestForQuoteDetails_Vendors] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendors] ([VendorID])
);

