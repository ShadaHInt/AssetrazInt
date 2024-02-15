CREATE TABLE [dbo].[InventoryTrackRegister] (
    [TrackID]     UNIQUEIDENTIFIER NOT NULL,
    [InventoryID] UNIQUEIDENTIFIER NOT NULL,
    [IssuedTo]    VARCHAR (100)    NULL,
    [EmailID]     VARCHAR (200)    NULL,
    [EmployeeID]  VARCHAR (15)     NULL,
    [IssuedDate]  DATETIME         NULL,
    [Reason]      VARCHAR (20)     NULL,
    [ReturnDate]  DATETIME         NULL,
    [Remarks]     VARCHAR (MAX)    NULL,
    [CreatedDate] DATETIME         NOT NULL,
    [CreatedBy]   VARCHAR (200)    NOT NULL,
    [UpdatedDate] DATETIME         NOT NULL,
    [UpdatedBy]   VARCHAR (200)    NOT NULL,
    CONSTRAINT [PK_InventoryTrackRegister] PRIMARY KEY CLUSTERED ([TrackID] ASC),
    CONSTRAINT [FK_InventoryTrackRegister_Inventories] FOREIGN KEY ([InventoryID]) REFERENCES [dbo].[Inventories] ([InventoryID])
);

