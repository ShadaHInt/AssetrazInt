CREATE TABLE [dbo].[Sources]
(
    [SourceID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [SourceName] VARCHAR(100) NOT NULL, 
    [Active] BIT NOT NULL, 
    [CreatedBy] VARCHAR(200) NOT NULL, 
    [CreatedDate] DATETIME NOT NULL, 
    [UpdatedBy] VARCHAR(200) NOT NULL, 
    [UpdatedDate] DATETIME NOT NULL 
)
