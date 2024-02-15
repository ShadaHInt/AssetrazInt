CREATE TABLE [dbo].[RequestForQuoteParticipants] (
    [ProcurementVendorID]  UNIQUEIDENTIFIER NOT NULL,
    [ProcurementRequestID] UNIQUEIDENTIFIER NOT NULL,
    [VendorID]             UNIQUEIDENTIFIER NOT NULL,
    [QutoeFilePath]        VARCHAR (1000)   NULL,
    [QuoteUploadedOn]      DATETIME         NULL,
    [QuoteUploadedBy]      VARCHAR (200)    NULL,
    [IsShortListed]        BIT              NOT NULL,
    [CreatedDate]          DATETIME         NOT NULL,
    [CreatedBy]            VARCHAR (200)    NOT NULL,
    [UpdatedDate]          DATETIME         NOT NULL,
    [UpdatedBy]            VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_VendorParticipation] PRIMARY KEY CLUSTERED ([ProcurementVendorID] ASC),
    CONSTRAINT [FK_VendorParticipation_ProcurementHeaders] FOREIGN KEY ([ProcurementRequestID]) REFERENCES [dbo].[RequestForQuoteHeaders] ([ProcurementRequestID]),
    CONSTRAINT [FK_VendorParticipation_Vendors] FOREIGN KEY ([VendorID]) REFERENCES [dbo].[Vendors] ([VendorID])
);

