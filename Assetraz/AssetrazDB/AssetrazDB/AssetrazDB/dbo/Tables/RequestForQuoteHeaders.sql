CREATE TABLE [dbo].[RequestForQuoteHeaders] (
    [ProcurementRequestID]     UNIQUEIDENTIFIER NOT NULL,
    [ProcurementRequestNumber] VARCHAR (20)     NOT NULL UNIQUE,
    [NetworkCompanyID]         UNIQUEIDENTIFIER NOT NULL,
    [RequestRaisedOn]          DATETIME         NULL,
    [RequestRaisedBy]          VARCHAR (200)    NULL,
    [ApprovalRequired]         BIT              CONSTRAINT [DF_ProcurementHeaders_ApprovalRequired] DEFAULT ((1)) NOT NULL,
    [ApprovedOn]               DATETIME         NULL,
    [ApprovedBy]               VARCHAR (200)    NULL,
    [Notes]                    VARCHAR (200)    NULL,
    [Comments]                 VARCHAR (MAX)    NULL,
    [Status]                   VARCHAR (15)     NOT NULL,
    [Active]                   BIT              NOT NULL,
    [CreatedDate]              DATETIME         NOT NULL,
    [CreatedBy]                VARCHAR (200)    NOT NULL,
    [UpdatedDate]              DATETIME         NOT NULL,
    [UpdatedBy]                VARCHAR (200)    NOT NULL,
    [AssociateName]            VARCHAR (200)    NULL,
    CONSTRAINT [PK_ProcurementHeaders] PRIMARY KEY CLUSTERED ([ProcurementRequestID] ASC),
    CONSTRAINT [FK_ProcurementHeaders_NetworkCompanies] FOREIGN KEY ([NetworkCompanyID]) REFERENCES [dbo].[NetworkCompanies] ([NetworkCompanyID])
);

