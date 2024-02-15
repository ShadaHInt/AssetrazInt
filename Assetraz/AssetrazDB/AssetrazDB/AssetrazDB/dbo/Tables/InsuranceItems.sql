CREATE TABLE [dbo].[InsuranceItems] (
    [InsuranceReferenceID] UNIQUEIDENTIFIER NOT NULL,
    [InventoryID]          UNIQUEIDENTIFIER NOT NULL,
    [ReferenceNumber]      UNIQUEIDENTIFIER NULL,
    [InsuranceOffice]      VARCHAR (100)    NULL,
    [PolicyNumber]         VARCHAR (50)     NULL,
    [PolicyStartDate]      DATETIME         NULL,
    [PolicyEndDate]        DATETIME         NULL,
    [PolicyFilePath]       VARCHAR (1000)   NULL,
    [InsuredBy]            VARCHAR (200)    NULL,
    [RequestRaisedOn]      DATETIME         NULL,
    [Status]               VARCHAR (20)     NOT NULL,
    [CreatedDate]          DATETIME         NOT NULL,
    [CreatedBy]            VARCHAR (200)    NOT NULL,
    [UpdatedDate]          DATETIME         NOT NULL,
    [UpdatedBy]            VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_InsuranceItems] PRIMARY KEY CLUSTERED ([InsuranceReferenceID] ASC),
    CONSTRAINT [FK_InsuranceItems_Inventories] FOREIGN KEY ([InventoryID]) REFERENCES [dbo].[Inventories] ([InventoryID])
);

