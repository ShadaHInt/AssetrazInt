CREATE TABLE [dbo].[Manufacturers] (
    [ManfacturerID]         UNIQUEIDENTIFIER NOT NULL,
    [ManufacturerName]      VARCHAR (100)    NOT NULL,
    [PreferredManufacturer] BIT              NOT NULL,
    [Active]                BIT              NOT NULL,
    [CreatedDate]           DATETIME         NOT NULL,
    [CreatedBy]             VARCHAR (200)    NOT NULL,
    [UpdatedDate]           DATETIME         NOT NULL,
    [UpdatedBy]             VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_Manufacturers] PRIMARY KEY CLUSTERED ([ManfacturerID] ASC)
);

