CREATE TABLE [dbo].[NetworkCompanies] (
    [NetworkCompanyID]    UNIQUEIDENTIFIER NOT NULL,
    [CompanyName]         VARCHAR (200)    NOT NULL,
    [CompanyAddressLine1] VARCHAR (200)    NOT NULL,
    [CompanyAddressLine2] VARCHAR (200)    NULL,
    [City]                VARCHAR (50)     NOT NULL,
    [State]               VARCHAR (50)     NOT NULL,
    [Country]             VARCHAR (50)     NOT NULL,
    [ContactNumber]       VARCHAR (20)     NOT NULL,
    [IsPrimary]           BIT              NULL,
    [Active]              BIT              NULL DEFAULT 'True',
    [CreatedDate]         DATETIME         NOT NULL,
    [CreatedBy]           VARCHAR (200)    NOT NULL,
    [UpdatedDate]         DATETIME         NOT NULL,
    [UpdatedBy]           VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_NetworkCompanies] PRIMARY KEY CLUSTERED ([NetworkCompanyID] ASC)
);

