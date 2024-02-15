CREATE TABLE [dbo].[InventoriesOtherSourcesHeaders]
(
	[InventoryOtherSourceID]                 		  UNIQUEIDENTIFIER NOT NULL,
    [SourceID]                            			  UNIQUEIDENTIFIER NULL,
    [DocumentID]                          			  VARCHAR (20)     NOT NULL UNIQUE,
	[DocumentNumber]								  VARCHAR(50)	   NULL, 
    [SupportingDocumentFilePath]                      VARCHAR (1000)   NULL,
    [Notes]                                           VARCHAR (MAX)    NULL,
    [ReceivedDate]                                    DATETIME         NOT NULL,
    [CreatedDate]                                     DATETIME         NOT NULL,
    [CreatedBy]                                       VARCHAR (200)    NOT NULL,
    [UpdatedDate]                                     DATETIME         NOT NULL,
    [UpdatedBy]                                       VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_InventoriesOtherSourcesHeader] PRIMARY KEY CLUSTERED ([InventoryOtherSourceID] ASC),
    CONSTRAINT [FK_InventoriesOtherSourcesHeader_Sources] FOREIGN KEY ([SourceID]) REFERENCES [dbo].[Sources] ([SourceID])
)
