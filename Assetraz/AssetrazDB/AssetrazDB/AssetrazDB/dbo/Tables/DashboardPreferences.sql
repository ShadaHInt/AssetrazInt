CREATE TABLE [dbo].[DashboardPreferences]
(
    [PreferenceID] UNIQUEIDENTIFIER NOT NULL, 
    [UserID] UNIQUEIDENTIFIER NOT NULL, 
    [NetworkCompanyID] UNIQUEIDENTIFIER NOT NULL, 
    [CategoryID] UNIQUEIDENTIFIER NOT NULL, 
    [CreatedDate] DATETIME NOT NULL, 
    [CreatedBy] VARCHAR(200) NOT NULL, 
    [UpdatedDate] DATETIME NOT NULL, 
    [UpdatedBy] VARCHAR(200) NOT NULL,
    [IsDeleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_DashboardPreferences] PRIMARY KEY CLUSTERED ([UserID] ASC, [NetworkCompanyID] ASC, [CategoryID] ASC),
    CONSTRAINT [FK_DashboardPreferences_UserPrivilegesWithDefault] FOREIGN KEY ([UserID]) REFERENCES [dbo].[UserPrivilegesWithDefault] ([UserID]),
    CONSTRAINT [FK_DashboardPreferences_NetworkCompanies] FOREIGN KEY ([NetworkCompanyID]) REFERENCES [dbo].[NetworkCompanies] ([NetworkCompanyID]),
    CONSTRAINT [FK_DashboardPreferences_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Categories] ([CategoryID]),
    CONSTRAINT [IX_DashboardPreferences_PreferenceID] UNIQUE NONCLUSTERED ([PreferenceID] ASC)
)