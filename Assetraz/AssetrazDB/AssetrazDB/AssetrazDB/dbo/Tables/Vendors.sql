CREATE TABLE [dbo].[Vendors] (
    [VendorID]           UNIQUEIDENTIFIER NOT NULL,
    [VendorName]         VARCHAR (200)    NOT NULL,
    [VendorAddressLine1] VARCHAR (200)    NOT NULL,
    [VendorAddressLine2] VARCHAR (200)    NULL,
    [City]               VARCHAR (50)     NOT NULL,
    [State]              VARCHAR (50)     NOT NULL,
    [Country]            VARCHAR (50)     NOT NULL,
    [GSTIN]              VARCHAR (50)     NULL,     
    [PreferredVendor]    BIT              NOT NULL,
    [ContactPerson]      VARCHAR (50)     NOT NULL,
    [ContactNumber]      VARCHAR (20)     NOT NULL,
    [EmailAddress]       VARCHAR (100)    NOT NULL,
    [Active]             BIT              NULL,
    [CreatedDate]        DATETIME         NOT NULL,
    [CreatedBy]          VARCHAR (200)    NOT NULL,
    [UpdatedDate]        DATETIME         NOT NULL,
    [UpdatedBy]          VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_Vendors] PRIMARY KEY CLUSTERED ([VendorID] ASC)
);

