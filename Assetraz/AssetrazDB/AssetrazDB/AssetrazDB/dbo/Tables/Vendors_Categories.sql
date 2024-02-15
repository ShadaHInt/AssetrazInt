CREATE TABLE [dbo].[Vendors_Categories] (
    [VendorID]    UNIQUEIDENTIFIER NOT NULL,
    [CategoryID]  UNIQUEIDENTIFIER NOT NULL,
    [Active]      BIT              NOT NULL,
    [CreatedDate] DATETIME         NOT NULL,
    [CreatedBy]   VARCHAR (200)    NOT NULL,
    [UpdatedDate] DATETIME         NOT NULL,
    [UpdatedBy]   VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_Vendors_Categories] PRIMARY KEY CLUSTERED ([VendorID] ASC, [CategoryID] ASC),
    CONSTRAINT [FK_Vendors_Categories_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Categories] ([CategoryID]),
    CONSTRAINT [FK_Vendors_Categories_Vendors] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendors] ([VendorID])
);

