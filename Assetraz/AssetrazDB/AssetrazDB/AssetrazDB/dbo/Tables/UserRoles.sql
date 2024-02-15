CREATE TABLE [dbo].[UserRoles] (
    [RoleID]   INT          IDENTITY (1, 1) NOT NULL,
    [RoleName] VARCHAR (25) NOT NULL,
    [Active]   BIT          NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([RoleID] ASC)
);

