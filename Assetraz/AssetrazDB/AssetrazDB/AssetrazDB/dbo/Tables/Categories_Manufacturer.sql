CREATE TABLE [dbo].[Categories_Manufacturer] (
    [CategroyID]    UNIQUEIDENTIFIER NOT NULL,
    [ManfacturerID] UNIQUEIDENTIFIER NOT NULL,
    [Active]        BIT              NOT NULL,
    [CreatedDate]   DATETIME         NOT NULL,
    [CreatedBy]     VARCHAR (200)    NOT NULL,
    [UpdatedDate]   DATETIME         NOT NULL,
    [UpdatedBy]     VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_Categories_Manufacturer] PRIMARY KEY CLUSTERED ([CategroyID] ASC, [ManfacturerID] ASC),
    CONSTRAINT [FK_Categories_Manufacturer_Categories] FOREIGN KEY ([CategroyID]) REFERENCES [dbo].[Categories] ([CategoryID]),
    CONSTRAINT [FK_Categories_Manufacturer_Manufacturers] FOREIGN KEY ([ManfacturerID]) REFERENCES [dbo].[Manufacturers] ([ManfacturerID])
);

