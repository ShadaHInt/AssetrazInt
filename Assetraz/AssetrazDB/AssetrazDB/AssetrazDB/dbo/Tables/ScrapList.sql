CREATE TABLE [dbo].[ScrapList]
(
	[ScrapAssetId]       UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [InventoryId]        UNIQUEIDENTIFIER NOT NULL, 
    [RefurbishedAssetId] UNIQUEIDENTIFIER NULL, 
    [RefurbishedDate]    DATETIME         NOT NULL, 
    [RefurbishedBy]      VARCHAR(200)     NOT NULL, 
    [Status]             VARCHAR(50)      NOT NULL, 
    [RemovedFromScrap ]  BIT              NULL, 
    [ScrappedDate]       DATETIME         NULL,
    [Remarks]            VARCHAR(MAX)     NULL, 
    [CreatedDate]        DATETIME         NOT NULL, 
    [CreatedBy]          VARCHAR(200)     NOT NULL, 
    [UpdatedDate]        DATETIME         NULL, 
    [UpdatedBy]          VARCHAR(200)     NULL,    
    CONSTRAINT [FK_ScrapList_Inventories] FOREIGN KEY ([InventoryId]) REFERENCES [dbo].[Inventories]([InventoryId]) 
)
