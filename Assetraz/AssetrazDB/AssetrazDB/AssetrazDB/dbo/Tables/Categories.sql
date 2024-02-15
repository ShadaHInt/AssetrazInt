CREATE TABLE [dbo].[Categories] (
    [CategoryID]        UNIQUEIDENTIFIER NOT NULL,
    [CategoryName]      VARCHAR (50)     NOT NULL,
    [UnitOfMeasurement] VARCHAR (50)     NULL,
    [Active]            BIT              NOT NULL,
    [Issuable]          BIT              NULL, 
    [AssetTagRequired]  BIT default 'False' NULL,
    [SerialNumberRequired]  BIT default 'False' NULL,
    [WarrantyRequired]  BIT default 'False' NULL,
    [CreatedDate]       DATETIME         NOT NULL,
    [CreatedBy]         VARCHAR (200)    NOT NULL,
    [UpdatedDate]       DATETIME         NOT NULL,
    [UpdatedBy]         VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED ([CategoryID] ASC)
);

