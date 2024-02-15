CREATE TABLE [dbo].[PurchaseOrderDetails] (
    [PurchaseOrderDetailsID] UNIQUEIDENTIFIER NOT NULL,
    [PurchaseOrderRequestID] UNIQUEIDENTIFIER NOT NULL,
    [CategoryID]             UNIQUEIDENTIFIER NOT NULL,
    [ManufacturerID]         UNIQUEIDENTIFIER NOT NULL,
    [ModelNumber]            VARCHAR (100)    NULL,
    [Specifications]         VARCHAR (MAX)    NOT NULL,
    [Quantity]               DECIMAL (18, 2)  NOT NULL,
    [RatePerQuantity]        MONEY            NOT NULL,
    [QuantityReceived]       DECIMAL (18, 2)  NULL,
    [CreatedDate]            DATETIME         NOT NULL,
    [CreatedBy]              VARCHAR (200)    NOT NULL,
    [UpdatedDate]            DATETIME         NOT NULL,
    [UpdatedBy]              VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_PurchaseOrderDetails] PRIMARY KEY CLUSTERED ([PurchaseOrderDetailsID] ASC),
    CONSTRAINT [FK_PurchaseOrderDetails_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Categories] ([CategoryID]),
    CONSTRAINT [FK_PurchaseOrderDetails_Manufacturers] FOREIGN KEY ([ManufacturerID]) REFERENCES [dbo].[Manufacturers] ([ManfacturerID]),
    CONSTRAINT [FK_PurchaseOrderDetails_PurchaseOrderHeaders] FOREIGN KEY ([PurchaseOrderRequestID]) REFERENCES [dbo].[PurchaseOrderHeaders] ([PurchaseOrderRequestID])
);

