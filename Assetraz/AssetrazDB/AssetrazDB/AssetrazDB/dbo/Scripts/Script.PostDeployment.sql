/*
Post-Deployment Script
*/
IF NOT EXISTS (SELECT TOP 1 * FROM [UserRoles])
BEGIN
    SET IDENTITY_INSERT [dbo].[UserRoles] ON 
    INSERT [dbo].[UserRoles] ([RoleID], [RoleName], [Active]) VALUES (1, N'IT Admin', 1)
    INSERT [dbo].[UserRoles] ([RoleID], [RoleName], [Active]) VALUES (2, N'Ops Admin', 1)
    INSERT [dbo].[UserRoles] ([RoleID], [RoleName], [Active]) VALUES (3, N'Supervisor', 1)
    INSERT [dbo].[UserRoles] ([RoleID], [RoleName], [Active]) VALUES (4, N'ProcurementApprover', 1)
    INSERT [dbo].[UserRoles] ([RoleID], [RoleName], [Active]) VALUES (5, N'Accounts Admin', 1)
    SET IDENTITY_INSERT [dbo].[UserRoles] OFF
END

IF NOT EXISTS (SELECT TOP 1 * FROM [UserPrivileges])
BEGIN
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'b2b95291-f98c-44d5-bb04-188f11e1fcca', NULL, N'rugmap@valorem.com', 3)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'33192982-6ec0-4831-a8cb-1d6adf3a91cd', NULL, N'senthilk@valorem.com', 1)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'96879d9f-c162-4bf1-bd2c-203d5d2c1488', NULL, N'rugmap@valorem.com', 2)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'490904d5-7b47-4641-83ce-27143605a400', NULL, N'senthilk@valorem.com', 2)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'07331a21-84bd-4589-a8c9-291893d8189c', NULL, N'murshidr@valorem.com', 3)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'ef11fb99-b45c-41e6-9bd2-2fd3bcc9fb94', NULL, N'akhilat@valorem.com', 2)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'd3a46b19-722b-4226-8271-4464718d2be0', NULL, N'murshidr@valorem.com', 1)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'9a80c5e6-24e4-460e-b0b3-5d210acc052e', NULL, N'akhilat@valorem.com', 1)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'1f4cc8d7-d0fb-463e-8bd9-67fe97842dc1', NULL, N'murshidr@valorem.com', 5)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'1bce73d6-fc53-4b7f-8da8-6a4178661bfa', NULL, N'fathimab@valorem.com', 4)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'9909c03c-6b9d-42b5-80f3-79942063becc', NULL, N'fathimab@valorem.com', 3)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'2359bdaf-3900-4777-b867-7cb4ca1a49fd', NULL, N'murshidr@valorem.com', 4)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'751a7039-15e3-4d6e-ae0b-ad5ea48758eb', NULL, N'rugmap@valorem.com', 1)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'a00c4962-c8d6-4093-8856-b477d26507de', NULL, N'akhilat@valorem.com', 3)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'cc2742cc-aadf-42d8-bfde-c3f98ae8ae34', NULL, N'fathimab@valorem.com', 2)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'fa49fae1-6a17-432b-a55e-c5fe803e8d2f', NULL, N'senthilk@valorem.com', 3)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'647915e1-538b-418f-8a23-e8adf58168ab', NULL, N'rugmap@valorem.com', 4)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'4dad1dc3-170e-4932-9a2e-f1a04c814f87', NULL, N'fathimab@valorem.com', 1)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'e81b7af2-bf15-47a2-a4f6-f20ae3148795', NULL, N'murshidr@valorem.com', 2)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'cd8b6cf5-bc0d-47b3-a34a-f4df48683a6b', NULL, N'akhilat@valorem.com', 4)
    INSERT [dbo].[UserPrivileges] ([UserID], [UserDomainID], [UserEmailID], [UserRoleID]) VALUES (N'f1961b97-9b4d-4ac1-8759-f942ffdebdd8', NULL, N'senthilk@valorem.com', 4)
END

IF NOT EXISTS (SELECT TOP 1 * FROM [Categories])
BEGIN
    INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'DF423251-4C7B-4954-B280-9461E2245CC1', N'Laptop', N'nos', 1, 1, 1, 1, 1, GETDATE(), N'senthilk@valorem.com', GETDATE(), N'senthilk@valorem.com')
    
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'4a603819-9236-4882-9bbf-047e9fc34440', N'No cat avial 3 at', N'nos', 1, 1, 1, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'4da58e46-4d7f-4e09-857e-08d9271611fa', N'Unavail cat 1', N'nos', 1, 1, 1, 1, 1, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'f960e5b3-cbb3-485a-bdc4-0fcfea737c7a', N'Laptop mndry', N'nos', 1, 1, 1, 1, 1, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'1578c6b5-9a2f-4fb8-b643-157ef8b2c305', N'Cat 1', N'nos', 0, 1, 0, 0, 0, GETDATE(), N'akhilat@valorem.com', GETDATE(), N'akhilat@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'56fae9d3-dbf7-4fb7-b56e-26ef91806653', N'Mouse', N'nos', 1, 1, 0, 1, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'330c8cbf-0399-4382-b16c-2b7e075dcfe1', N'Unavail cat 5', N'nos', 1, 1, 0, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'06e6a114-ce5c-44d6-90b9-5faef1731379', N'Dev new', N'nos', 1, 1, 1, 1, 0, GETDATE(), N'fathimab@valorem.com', GETDATE(), N'akhilat@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'6f7a5f1a-32ac-40c3-8fc9-68856c832439', N'Unavail cat 2', N'nos', 1, 1, 1, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'f1e9c1d5-878c-4ea4-8765-6ccf9f7b2ba1', N'Keyboard assettag', N'nos', 1, 1, 1, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'050344e7-9fa6-4860-9339-8ff8d5ce1e27', N'M2', N'nos', 1, 1, 0, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'95fc254a-4f2c-47a1-af21-93c0340542f6', N'No cat avail 2', N'nos', 1, 1, 0, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'c2c5ab0a-7a07-46a9-b746-96a03befb3ff', N'M1', N'nos', 1, 1, 1, 1, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'939098bf-b656-4de8-9f83-9b169c0ae8b1', N'No cat avil 4 sn', N'nos', 1, 1, 0, 1, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'e6b4c33c-e99b-4e9e-a483-aa76b72c3a3f', N'Test category', N'nos', 1, 1, 1, 1, 1, GETDATE(), N'akhilat@valorem.com', GETDATE(), N'akhilat@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'4654eaf5-0538-49d6-9705-c498a0d0d7b8', N'Unavail cat 4', N'nos', 1, 1, 0, 0, 1, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'634bd974-0408-4ac6-b789-e08f1606a476', N'Wifi dongle none', N'nos', 1, 1, 0, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'9af35f6f-ac87-4b15-9693-e2f947099aa0', N'Test', N'test', 0, 0, 0, 0, 0, GETDATE(), N'senthilk@valorem.com', CGETDATE(), N'senthilk@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'f2e6075c-bc26-4333-94ca-ef87a3085042', N'New', N'nos', 0, 0, 0, 0, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'77d479e3-2bab-40ed-a4cf-efb589ebab50', N'Test 123', N'nos', 1, 0, 0, 0, 0, GETDATE(), N'senthilk@valorem.com', GETDATE(), N'senthilk@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'38630ed2-efdf-40f4-bf5f-f5524699d22e', N'Unavail cat 3', N'nos', 1, 1, 0, 1, 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'15cc96bc-273a-4d52-bb3c-fb4d11bc4359', N'No category avail', N'nos', 1, 1, 1, 1, 1, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'c612eca4-22ba-46fd-81b5-fd1e7e18eb20', N'Headphones warr', N'nos', 1, 1, 0, 0, 1, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    --INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [UnitOfMeasurement], [Active], [Issuable], [AssetTagRequired], [SerialNumberRequired], [WarrantyRequired], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'2e5abcb1-2a12-4474-a8e1-ff063834a88f', N'No cat avail 5 war', N'nos', 1, 1, 0, 0, 1, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')

END

IF NOT EXISTS (SELECT TOP 1 * FROM [Manufacturers])
BEGIN
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'e00f8b9f-e8b4-45d0-b491-031221238686', N'HP', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'd18e1a1f-caf6-4dea-bad9-177d79c79298', N'Microsoft', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'2bf6aa33-79ca-4d28-ab2d-1d2fb9bff16a', N'Nokia', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'846ebddb-5a3c-48e1-a41c-24d055a1626d', N'Logitech', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'9b28997c-a3af-419d-b94e-2cfba49fbdef', N'Jabra', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'0dff4084-ac2b-4ffe-a0fc-2f6644eaee91', N'Dell', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'1c1a30bc-6cd9-44f4-8ce8-51fb06bb30a8', N'Lenovo', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'a9e5f25d-1256-4cd6-b8bb-56bbbb2124ea', N'LG', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'4ed809d6-db20-4943-803e-7bcaa815cfcc', N'Seagate', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'e09c29ac-bb94-4c47-8759-7e60d7e37513', N'Samsung', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'e4b32d5f-b361-443f-ba73-a7f790b4475a', N'Polycom', 1, 1,GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'f631b621-dd21-43f8-b386-b4e7bbac3b8a', N'Sony', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'dd421c16-f12c-4cb3-8450-c5d83d88194e', N'MI', 0, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Manufacturers] ([ManfacturerID], [ManufacturerName], [PreferredManufacturer], [Active], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'20d53556-5d43-43d1-8315-f7c9f2bad9fe', N'CISCO', 1, 1, GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
END

IF NOT EXISTS (SELECT TOP 1 * FROM [NetworkCompanies])
BEGIN
    INSERT [dbo].[NetworkCompanies] ([NetworkCompanyID], [CompanyName], [CompanyAddressLine1], [CompanyAddressLine2], [City], [State], [Country], [ContactNumber], [IsPrimary], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'41C2B08A-19F9-4023-8503-37B2FB77FD83', N'Reply Inc', N'Sck-02, smart city', N'Kochi', N'Kakkanad', N'Kerala', N'India', N'8907654321', 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'fathimab@valorem.com')
    INSERT [dbo].[NetworkCompanies] ([NetworkCompanyID], [CompanyName], [CompanyAddressLine1], [CompanyAddressLine2], [City], [State], [Country], [ContactNumber], [IsPrimary], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'620C471F-4E08-4C11-835B-3A17B643E85C', N'Concept reply', N'Sck-02, smart city', N'Kochi', N'Kakkanad', N'Kerala', N'India', N'8907654321', 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'fathimab@valorem.com')
    INSERT [dbo].[NetworkCompanies] ([NetworkCompanyID], [CompanyName], [CompanyAddressLine1], [CompanyAddressLine2], [City], [State], [Country], [ContactNumber], [IsPrimary], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'552474E5-7995-4372-BF17-CDD11BF16A4C', N'Macro reply', N'sck-01, smart city', N'Kochi', N'Kakkanad', N'Kerala', N'India', N'8907776555', 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    INSERT [dbo].[NetworkCompanies] ([NetworkCompanyID], [CompanyName], [CompanyAddressLine1], [CompanyAddressLine2], [City], [State], [Country], [ContactNumber], [IsPrimary], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'7934356D-E1D4-4612-9EF3-9CB574F9AD4B', N'Cluster reply', N'sck-01, smart city', N'Kochi', N'Kakkanad', N'Kerala', N'India', N'6789000000', 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    INSERT [dbo].[NetworkCompanies] ([NetworkCompanyID], [CompanyName], [CompanyAddressLine1], [CompanyAddressLine2], [City], [State], [Country], [ContactNumber], [IsPrimary], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'8C5D6E0B-E9D6-41DC-94BA-A3CB66119E1E', N'Valorem Private Limited', N'sck-01, smart city, utc', N'Kochi', N'Kakkanad', N'Kerala', N'India', N'9087654321', 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
    INSERT [dbo].[NetworkCompanies] ([NetworkCompanyID], [CompanyName], [CompanyAddressLine1], [CompanyAddressLine2], [City], [State], [Country], [ContactNumber], [IsPrimary], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'F15C8051-7311-4C53-B141-421C33FBBC77', N'Sagepath reply', N'sck-01, smart city', N'Kochi', N'Kakkanad', N'Kerala', N'India', N'9876544304', 0, GETDATE(), N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com')
END

IF NOT EXISTS (SELECT TOP 1 * FROM [Sources])
BEGIN
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'745ab37d-ace0-4b17-8ca3-5dc9c3d3b0ff', N'Valorem', 1, N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com', GETDATE())
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'49d5f909-be22-4550-9eec-73d52c71136f', N'Cluster reply', 1, N'rugmap@valorem.com', GETDATE(), N'fathimab@valorem.com', GETDATE())
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'1345611a-09f2-4a4b-90b3-823a999db103', N'Microsoft', 1, N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com', GETDATE())
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'70d2808b-836e-41e3-9a8f-b1852e1c44ea', N'New Source', 1, N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com', GETDATE())
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'42d2f832-bae3-49d9-a6e0-c1e09ef26a91', N'Test source', 1, N'akhilat@valorem.com', GETDATE(), N'akhilat@valorem.com', GETDATE())
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'0f1f9f16-3776-465f-ac0e-d45e9b56f80d', N'Sagepath', 1, N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com', GETDATE())
    INSERT [dbo].[Sources] ([SourceID], [SourceName], [Active], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate]) VALUES (N'f2b3fc42-27a7-4785-9790-fd332dbfa635', N'Reply', 1, N'rugmap@valorem.com', GETDATE(), N'rugmap@valorem.com', GETDATE())
END

IF NOT EXISTS (SELECT TOP 1 * FROM [Vendors])
BEGIN
    INSERT [dbo].[Vendors] ([VendorID], [VendorName], [VendorAddressLine1], [VendorAddressLine2], [City], [State], [Country], [GSTIN], [PreferredVendor], [ContactPerson], [ContactNumber], [EmailAddress], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'5f91ad82-d2d6-42f3-b746-c4ba04abac94', N'SYNERGEZE', N'Temp Address 1', N'Temp Address 2', N'Kochi', N'Kerala', N'India', N'TEST1', 1, N'Contact Person-1', N'NULL', N'senthilk@valorem.com', GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
    INSERT [dbo].[Vendors] ([VendorID], [VendorName], [VendorAddressLine1], [VendorAddressLine2], [City], [State], [Country], [GSTIN], [PreferredVendor], [ContactPerson], [ContactNumber], [EmailAddress], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy]) VALUES (N'f81c425e-b2d7-4588-9549-ca16277d09ba', N'TECHNOLINE', N'Temp Address 1', N'Temp Address 2', N'Kochi', N'Kerala', N'India', N'TEST2', 1, N'Contact Person-1', N'NULL', N'senthilk@valorem.com', GETDATE(), N'Senthil B', GETDATE(), N'Senthil B')
END

/* The below block is required only when we run the the cut over script as part of production go-live */

--IF NOT EXISTS (SELECT TOP 1 * FROM [InventoriesOtherSourcesHeaders])
--BEGIN

--  INSERT INTO [InventoriesOtherSourcesHeaders]
--             ([InventoryOtherSourceID] ,[SourceID] ,[DocumentID] ,[DocumentNumber] ,[SupportingDocumentFilePath] ,[Notes] ,[ReceivedDate] ,[CreatedDate] ,[CreatedBy] ,[UpdatedDate] ,[UpdatedBy])
--   VALUES
--     ('5740D9AE-133E-47D9-9E8B-0B5EC97C8A3D',NULL,CONCAT('OTH-',FORMAT(GETDATE(),'yyyyMMdd'),'-00001'),NULL,NULL,'Cut Over Stock',GETDATE(),GETDATE(),'senthilk@valorem.com',GETDATE(),'senthilk@valorem.com')

--  INSERT INTO [InventoriesOtherSourcesHeaders]
--     ([InventoryOtherSourceID] ,[SourceID] ,[DocumentID] ,[DocumentNumber] ,[SupportingDocumentFilePath] ,[Notes] ,[ReceivedDate] ,[CreatedDate] ,[CreatedBy] ,[UpdatedDate] ,[UpdatedBy])
--   VALUES
--     ('DBCC5FFA-C7B6-413D-BA76-60C8374B0480',NULL,CONCAT('OTH-',FORMAT(GETDATE(),'yyyyMMdd'),'-00002'),NULL,NULL,'Cut Over Stock',GETDATE(),GETDATE(),'senthilk@valorem.com',GETDATE(),'senthilk@valorem.com')

--  INSERT INTO [InventoriesOtherSourcesHeaders]
--     ([InventoryOtherSourceID] ,[SourceID] ,[DocumentID] ,[DocumentNumber] ,[SupportingDocumentFilePath] ,[Notes] ,[ReceivedDate] ,[CreatedDate] ,[CreatedBy] ,[UpdatedDate] ,[UpdatedBy])
--   VALUES
--     ('940C852A-B8A4-440E-A410-9422D5A109F1',NULL,CONCAT('OTH-',FORMAT(GETDATE(),'yyyyMMdd'),'-00003'),NULL,NULL,'Cut Over Stock',GETDATE(),GETDATE(),'senthilk@valorem.com',GETDATE(),'senthilk@valorem.com')

--  INSERT INTO [InventoriesOtherSourcesHeaders]
--     ([InventoryOtherSourceID] ,[SourceID] ,[DocumentID] ,[DocumentNumber] ,[SupportingDocumentFilePath] ,[Notes] ,[ReceivedDate] ,[CreatedDate] ,[CreatedBy] ,[UpdatedDate] ,[UpdatedBy])
--   VALUES
--     ('C0A5D7F9-C060-4C10-BE62-5A3B286BE43D',NULL,CONCAT('OTH-',FORMAT(GETDATE(),'yyyyMMdd'),'-00004'),NULL,NULL,'Cut Over Stock',GETDATE(),GETDATE(),'senthilk@valorem.com',GETDATE(),'senthilk@valorem.com')

--  INSERT INTO [InventoriesOtherSourcesHeaders]
--     ([InventoryOtherSourceID] ,[SourceID] ,[DocumentID] ,[DocumentNumber] ,[SupportingDocumentFilePath] ,[Notes] ,[ReceivedDate] ,[CreatedDate] ,[CreatedBy] ,[UpdatedDate] ,[UpdatedBy])
--   VALUES
--     ('27B95C3B-CEC7-4EA8-AC22-DE9351EF472B',NULL,CONCAT('OTH-',FORMAT(GETDATE(),'yyyyMMdd'),'-00005'),NULL,NULL,'Cut Over Stock',GETDATE(),GETDATE(),'senthilk@valorem.com',GETDATE(),'senthilk@valorem.com')

--END