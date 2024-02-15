CREATE TABLE [dbo].[RefurbishedAssets] (
    [RefurbishAssetID] UNIQUEIDENTIFIER NOT NULL,
    [InventoryID]      UNIQUEIDENTIFIER NOT NULL,
    [ReturnedDate]     DATETIME         NOT NULL,
    [RefurbishedDate]  DATETIME         NULL,
    [RefurbishedBy]    VARCHAR (200)    NULL,
    [Status]           VARCHAR (50)     NOT NULL,
    [Reason]           VARCHAR(20)      NULL, 
    [ReturnedBy]       VARCHAR(200)     NULL, 
    [Remarks]          VARCHAR (MAX)    NULL,
    [CreatedDate]      DATETIME         NOT NULL,
    [CreatedBy]        VARCHAR (200)    NOT NULL,
    [UpdatedDate]      DATETIME         NULL,
    [UpdatedBy]        VARCHAR (200)    NULL,
   
    CONSTRAINT [PK_RefurbishedAssets] PRIMARY KEY CLUSTERED ([RefurbishAssetID] ASC),
    CONSTRAINT [FK_RefurbishedAssets_Inventories] FOREIGN KEY ([InventoryID]) REFERENCES [dbo].[Inventories] ([InventoryID])
);

