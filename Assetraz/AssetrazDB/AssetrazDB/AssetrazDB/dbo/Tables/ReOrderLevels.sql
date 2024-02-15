CREATE TABLE [dbo].[ReOrderLevels]
(
	[ReOrderID] UNIQUEIDENTIFIER NOT NULL, 
    [CategoryID] UNIQUEIDENTIFIER NOT NULL, 
    [NetworkCompanyID] UNIQUEIDENTIFIER NOT NULL, 
    [ReOrderLevel] INT NOT NULL DEFAULT 0, 
    [CriticalLevel] INT NOT NULL DEFAULT 0, 
    [WarningLevel] INT NOT NULL DEFAULT 0 ,
    CONSTRAINT [PK_ReOrderLevels] PRIMARY KEY CLUSTERED ([ReOrderID] ASC),
    CONSTRAINT [FK_ReOrderLevels_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Categories] ([CategoryID]),
    CONSTRAINT [FK_ReOrderLevels_NetworkCompany] FOREIGN KEY ([NetworkCompanyID]) REFERENCES [dbo].[NetworkCompanies] ([NetworkCompanyID])
)

