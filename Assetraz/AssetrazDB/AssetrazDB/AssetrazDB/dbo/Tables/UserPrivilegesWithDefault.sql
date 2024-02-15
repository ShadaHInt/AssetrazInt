CREATE TABLE [dbo].[UserPrivilegesWithDefault]
(
	[UserID]        UNIQUEIDENTIFIER                 NOT NULL,
    [UserDomainID]  VARCHAR (50)                         NULL,
    [UserEmailID]   VARCHAR (200)                    NOT NULL,
    [UserName]      VARCHAR (200)                        NULL,
    [UserRoleID]    INT                              NOT NULL,
    [IsDefaultRole] BIT              DEFAULT 'False' NOT NULL ,
    CONSTRAINT [PK_UserPrivilegesWithDefault] PRIMARY KEY CLUSTERED ([UserID] ASC),
    CONSTRAINT [FK_UserPrivilegesWithDefault] FOREIGN KEY ([UserRoleID]) REFERENCES [dbo].[UserRoles] ([RoleID])
)
