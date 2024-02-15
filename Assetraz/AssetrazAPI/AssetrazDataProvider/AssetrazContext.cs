using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using AssetrazDataProvider.Entities;

namespace AssetrazDataProvider
{
    public partial class AssetrazContext : DbContext
    {
        public AssetrazContext()
        {
        }

        public AssetrazContext(DbContextOptions<AssetrazContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CategoriesManufacturer> CategoriesManufacturers { get; set; } = null!;
        public virtual DbSet<Category> Categories { get; set; } = null!;
        public virtual DbSet<DashboardPreference> DashboardPreferences { get; set; } = null!;
        public virtual DbSet<EmailLog> EmailLogs { get; set; } = null!;
        public virtual DbSet<InsuranceItem> InsuranceItems { get; set; } = null!;
        public virtual DbSet<InventoriesOtherSourcesHeader> InventoriesOtherSourcesHeaders { get; set; } = null!;
        public virtual DbSet<Inventory> Inventories { get; set; } = null!;
        public virtual DbSet<InventoryTrackRegister> InventoryTrackRegisters { get; set; } = null!;
        public virtual DbSet<Invoice> Invoices { get; set; } = null!;
        public virtual DbSet<MaintenanceRequest> MaintenanceRequests { get; set; } = null!;
        public virtual DbSet<Manufacturer> Manufacturers { get; set; } = null!;
        public virtual DbSet<NetworkCompany> NetworkCompanies { get; set; } = null!;
        public virtual DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; set; } = null!;
        public virtual DbSet<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; } = null!;
        public virtual DbSet<PurchaseRequest> PurchaseRequests { get; set; } = null!;
        public virtual DbSet<ReOrderLevel> ReOrderLevels { get; set; } = null!;
        public virtual DbSet<RefurbishedAsset> RefurbishedAssets { get; set; } = null!;
        public virtual DbSet<RequestForQuoteDetail> RequestForQuoteDetails { get; set; } = null!;
        public virtual DbSet<RequestForQuoteHeader> RequestForQuoteHeaders { get; set; } = null!;
        public virtual DbSet<RequestForQuoteParticipant> RequestForQuoteParticipants { get; set; } = null!;
        public virtual DbSet<ScrapList> ScrapLists { get; set; } = null!;
        public virtual DbSet<Source> Sources { get; set; } = null!;
        public virtual DbSet<UserPrivilegesWithDefault> UserPrivilegesWithDefaults { get; set; } = null!;
        public virtual DbSet<UserRole> UserRoles { get; set; } = null!;
        public virtual DbSet<Vendor> Vendors { get; set; } = null!;
        public virtual DbSet<VendorsCategory> VendorsCategories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CategoriesManufacturer>(entity =>
            {
                entity.HasKey(e => new { e.CategroyId, e.ManfacturerId });

                entity.ToTable("Categories_Manufacturer");

                entity.Property(e => e.CategroyId).HasColumnName("CategroyID");

                entity.Property(e => e.ManfacturerId).HasColumnName("ManfacturerID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Categroy)
                    .WithMany(p => p.CategoriesManufacturers)
                    .HasForeignKey(d => d.CategroyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Categories_Manufacturer_Categories");

                entity.HasOne(d => d.Manfacturer)
                    .WithMany(p => p.CategoriesManufacturers)
                    .HasForeignKey(d => d.ManfacturerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Categories_Manufacturer_Manufacturers");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.CategoryId)
                    .ValueGeneratedNever()
                    .HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.UnitOfMeasurement)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<DashboardPreference>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.NetworkCompanyId, e.CategoryId });

                entity.HasIndex(e => e.PreferenceId, "IX_DashboardPreferences_PreferenceID")
                    .IsUnique();

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.Property(e => e.NetworkCompanyId).HasColumnName("NetworkCompanyID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.PreferenceId).HasColumnName("PreferenceID");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.DashboardPreferences)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DashboardPreferences_Categories");

                entity.HasOne(d => d.NetworkCompany)
                    .WithMany(p => p.DashboardPreferences)
                    .HasForeignKey(d => d.NetworkCompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DashboardPreferences_NetworkCompanies");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.DashboardPreferences)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DashboardPreferences_UserPrivilegesWithDefault");
            });

            modelBuilder.Entity<EmailLog>(entity =>
            {
                entity.HasKey(e => e.LogId)
                    .HasName("PK__EmailLog__5E5499A8E1294DBE");

                entity.Property(e => e.LogId)
                    .ValueGeneratedNever()
                    .HasColumnName("LogID");

                entity.Property(e => e.CcList).IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Message)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ToList).IsUnicode(false);
            });

            modelBuilder.Entity<InsuranceItem>(entity =>
            {
                entity.HasKey(e => e.InsuranceReferenceId);

                entity.Property(e => e.InsuranceReferenceId)
                    .ValueGeneratedNever()
                    .HasColumnName("InsuranceReferenceID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.InsuranceOffice)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.InsuredBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.InventoryId).HasColumnName("InventoryID");

                entity.Property(e => e.PolicyEndDate).HasColumnType("datetime");

                entity.Property(e => e.PolicyFilePath)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.PolicyNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PolicyStartDate).HasColumnType("datetime");

                entity.Property(e => e.RequestRaisedOn).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Inventory)
                    .WithMany(p => p.InsuranceItems)
                    .HasForeignKey(d => d.InventoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InsuranceItems_Inventories");
            });

            modelBuilder.Entity<InventoriesOtherSourcesHeader>(entity =>
            {
                entity.HasKey(e => e.InventoryOtherSourceId)
                    .HasName("PK_InventoriesOtherSourcesHeader");

                entity.HasIndex(e => e.DocumentId, "UQ__Inventor__1ABEEF6E59B2AB37")
                    .IsUnique();

                entity.Property(e => e.InventoryOtherSourceId)
                    .ValueGeneratedNever()
                    .HasColumnName("InventoryOtherSourceID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DocumentId)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("DocumentID");

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Notes).IsUnicode(false);

                entity.Property(e => e.ReceivedDate).HasColumnType("datetime");

                entity.Property(e => e.SourceId).HasColumnName("SourceID");

                entity.Property(e => e.SupportingDocumentFilePath)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Source)
                    .WithMany(p => p.InventoriesOtherSourcesHeaders)
                    .HasForeignKey(d => d.SourceId)
                    .HasConstraintName("FK_InventoriesOtherSourcesHeader_Sources");
            });

            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.Property(e => e.InventoryId)
                    .ValueGeneratedNever()
                    .HasColumnName("InventoryID");

                entity.Property(e => e.AssetStatus)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.AssetTagNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.AssetValue).HasColumnType("money");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.InventoryOtherSourceId).HasColumnName("InventoryOtherSourceID");

                entity.Property(e => e.ManufacturerId).HasColumnName("ManufacturerID");

                entity.Property(e => e.ModelNumber)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.NetworkCompanyId).HasColumnName("NetworkCompanyID");

                entity.Property(e => e.PurchaseOrderRequestId).HasColumnName("PurchaseOrderRequestID");

                entity.Property(e => e.Remarks).IsUnicode(false);

                entity.Property(e => e.SerialNumber)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Specifications).IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.UserRequestNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.WarrentyDate).HasColumnType("datetime");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Inventories)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventories_Categories");

                entity.HasOne(d => d.Manufacturer)
                    .WithMany(p => p.Inventories)
                    .HasForeignKey(d => d.ManufacturerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventories_Manufacturers");

                entity.HasOne(d => d.PurchaseOrderRequest)
                    .WithMany(p => p.Inventories)
                    .HasForeignKey(d => d.PurchaseOrderRequestId)
                    .HasConstraintName("FK_Inventories_PurchaseOrderHeaders");
            });

            modelBuilder.Entity<InventoryTrackRegister>(entity =>
            {
                entity.HasKey(e => e.TrackId);

                entity.ToTable("InventoryTrackRegister");

                entity.Property(e => e.TrackId)
                    .ValueGeneratedNever()
                    .HasColumnName("TrackID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EmailId)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("EmailID");

                entity.Property(e => e.EmployeeId)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasColumnName("EmployeeID");

                entity.Property(e => e.InventoryId).HasColumnName("InventoryID");

                entity.Property(e => e.IssuedDate).HasColumnType("datetime");

                entity.Property(e => e.IssuedTo)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Reason)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Remarks).IsUnicode(false);

                entity.Property(e => e.ReturnDate).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Inventory)
                    .WithMany(p => p.InventoryTrackRegisters)
                    .HasForeignKey(d => d.InventoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InventoryTrackRegister_Inventories");
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.Property(e => e.InvoiceId)
                    .ValueGeneratedNever()
                    .HasColumnName("InvoiceID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.InventoryId).HasColumnName("InventoryID");

                entity.Property(e => e.InvoiceDate).HasColumnType("datetime");

                entity.Property(e => e.InvoiceFilePath)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.InvoiceNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.InvoiceUploadedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.InvoiceUploadedOn).HasColumnType("datetime");

                entity.Property(e => e.PurchaseOrderRequestId).HasColumnName("PurchaseOrderRequestID");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.PurchaseOrderRequest)
                    .WithMany(p => p.Invoices)
                    .HasForeignKey(d => d.PurchaseOrderRequestId)
                    .HasConstraintName("FK_Invoices_PurchaseOrderHeaders");
            });

            modelBuilder.Entity<MaintenanceRequest>(entity =>
            {
                entity.HasKey(e => e.RequestId);

                entity.HasIndex(e => e.MaintenanceRequestNumber, "UQ__Maintena__429C5BC5DE425FDD")
                    .IsUnique();

                entity.Property(e => e.RequestId)
                    .ValueGeneratedNever()
                    .HasColumnName("RequestID");

                entity.Property(e => e.Address).IsUnicode(false);

                entity.Property(e => e.CreatedBy).IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.EmployeeName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FaultyAssetReceivedDate).HasColumnType("datetime");

                entity.Property(e => e.FaultyAssetSentDate).HasColumnType("datetime");

                entity.Property(e => e.InventoryId).HasColumnName("InventoryID");

                entity.Property(e => e.MaintenanceRequestNumber)
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Priority)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Remarks).IsUnicode(false);

                entity.Property(e => e.RepairedAssetCourierProvider)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.RepairedAssetCourierReference)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.RepairedAssetCourierSentDate).HasColumnType("datetime");

                entity.Property(e => e.RepairedAssetReceivedDate).HasColumnType("datetime");

                entity.Property(e => e.ReplacementAssetCourierProvider)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ReplacementAssetCourierReference)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.ReplacementAssetCourierSentDate).HasColumnType("datetime");

                entity.Property(e => e.ReplacementAssetReceivedDate).HasColumnType("datetime");

                entity.Property(e => e.ResolvedDate).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.SubStatus)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SubmittedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.SubmittedDate).HasColumnType("datetime");

                entity.Property(e => e.SupportCallDate).HasColumnType("datetime");

                entity.Property(e => e.SupportCallTrackId)
                    .HasMaxLength(25)
                    .IsUnicode(false)
                    .HasColumnName("SupportCallTrackID");

                entity.Property(e => e.TargetDate).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Inventory)
                    .WithMany(p => p.MaintenanceRequests)
                    .HasForeignKey(d => d.InventoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MaintenanceRequests_Inventories");
            });

            modelBuilder.Entity<Manufacturer>(entity =>
            {
                entity.HasKey(e => e.ManfacturerId);

                entity.Property(e => e.ManfacturerId)
                    .ValueGeneratedNever()
                    .HasColumnName("ManfacturerID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ManufacturerName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<NetworkCompany>(entity =>
            {
                entity.Property(e => e.NetworkCompanyId)
                    .ValueGeneratedNever()
                    .HasColumnName("NetworkCompanyID");

                entity.Property(e => e.City)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyAddressLine1)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyAddressLine2)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ContactNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Country)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.State)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<PurchaseOrderDetail>(entity =>
            {
                entity.HasKey(e => e.PurchaseOrderDetailsId);

                entity.Property(e => e.PurchaseOrderDetailsId)
                    .ValueGeneratedNever()
                    .HasColumnName("PurchaseOrderDetailsID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ManufacturerId).HasColumnName("ManufacturerID");

                entity.Property(e => e.ModelNumber)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PurchaseOrderRequestId).HasColumnName("PurchaseOrderRequestID");

                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.QuantityReceived).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.RatePerQuantity).HasColumnType("money");

                entity.Property(e => e.Specifications).IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseOrderDetails_Categories");

                entity.HasOne(d => d.Manufacturer)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.ManufacturerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseOrderDetails_Manufacturers");

                entity.HasOne(d => d.PurchaseOrderRequest)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.PurchaseOrderRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseOrderDetails_PurchaseOrderHeaders");
            });

            modelBuilder.Entity<PurchaseOrderHeader>(entity =>
            {
                entity.HasKey(e => e.PurchaseOrderRequestId);

                entity.HasIndex(e => e.PurchaseOrderNumber, "UQ__Purchase__962419489F6E3E82")
                    .IsUnique();

                entity.Property(e => e.PurchaseOrderRequestId)
                    .ValueGeneratedNever()
                    .HasColumnName("PurchaseOrderRequestID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.NetworkCompanyId).HasColumnName("NetworkCompanyID");

                entity.Property(e => e.PogeneratedOn)
                    .HasColumnType("datetime")
                    .HasColumnName("POGeneratedOn");

                entity.Property(e => e.ProcurementRequestId).HasColumnName("ProcurementRequestID");

                entity.Property(e => e.PurchaseOrderNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.RequestRaisedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.RequestRaisedOn).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.VendorId).HasColumnName("VendorID");

                entity.HasOne(d => d.NetworkCompany)
                    .WithMany(p => p.PurchaseOrderHeaders)
                    .HasForeignKey(d => d.NetworkCompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseOrderHeaders_NetworkCompanies");

                entity.HasOne(d => d.ProcurementRequest)
                    .WithMany(p => p.PurchaseOrderHeaders)
                    .HasForeignKey(d => d.ProcurementRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseOrderHeaders_RequestForQuoteHeaders");

                entity.HasOne(d => d.Vendor)
                    .WithMany(p => p.PurchaseOrderHeaders)
                    .HasForeignKey(d => d.VendorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseOrderHeaders_Vendors");
            });

            modelBuilder.Entity<PurchaseRequest>(entity =>
            {
                entity.HasKey(e => e.RequestId);

                entity.HasIndex(e => e.PurchaseRequestNumber, "UQ__Purchase__2DF755138716D32C")
                    .IsUnique();

                entity.Property(e => e.RequestId)
                    .ValueGeneratedNever()
                    .HasColumnName("RequestID");

                entity.Property(e => e.AdminComments).IsUnicode(false);

                entity.Property(e => e.ApprovedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ApprovedOn).HasColumnType("datetime");

                entity.Property(e => e.ApproverName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Comments).IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EmployeeName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FullfilledBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FullfilledOn).HasColumnType("datetime");

                entity.Property(e => e.InventoryId).HasColumnName("InventoryID");

                entity.Property(e => e.ItrequestNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("ITRequestNumber");

                entity.Property(e => e.NetworkCompanyId).HasColumnName("NetworkCompanyID");

                entity.Property(e => e.Priority)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.PurchaseRequestNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Purpose).IsUnicode(false);

                entity.Property(e => e.Status)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.SubmittedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.SubmittedOn).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.PurchaseRequests)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseRequests_Categories");

                entity.HasOne(d => d.NetworkCompany)
                    .WithMany(p => p.PurchaseRequests)
                    .HasForeignKey(d => d.NetworkCompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchaseRequests_NetworkCompanies");
            });

            modelBuilder.Entity<ReOrderLevel>(entity =>
            {
                entity.HasKey(e => e.ReOrderId);

                entity.Property(e => e.ReOrderId)
                    .ValueGeneratedNever()
                    .HasColumnName("ReOrderID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.NetworkCompanyId).HasColumnName("NetworkCompanyID");

                entity.Property(e => e.ReOrderLevel1).HasColumnName("ReOrderLevel");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ReOrderLevels)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReOrderLevels_Categories");

                entity.HasOne(d => d.NetworkCompany)
                    .WithMany(p => p.ReOrderLevels)
                    .HasForeignKey(d => d.NetworkCompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReOrderLevels_NetworkCompany");
            });

            modelBuilder.Entity<RefurbishedAsset>(entity =>
            {
                entity.HasKey(e => e.RefurbishAssetId);

                entity.Property(e => e.RefurbishAssetId)
                    .ValueGeneratedNever()
                    .HasColumnName("RefurbishAssetID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.InventoryId).HasColumnName("InventoryID");

                entity.Property(e => e.Reason)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.RefurbishedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.RefurbishedDate).HasColumnType("datetime");

                entity.Property(e => e.Remarks).IsUnicode(false);

                entity.Property(e => e.ReturnedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ReturnedDate).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Inventory)
                    .WithMany(p => p.RefurbishedAssets)
                    .HasForeignKey(d => d.InventoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RefurbishedAssets_Inventories");
            });

            modelBuilder.Entity<RequestForQuoteDetail>(entity =>
            {
                entity.HasKey(e => e.ProcurementDetailsId)
                    .HasName("PK_ProcurementDetails");

                entity.Property(e => e.ProcurementDetailsId)
                    .ValueGeneratedNever()
                    .HasColumnName("ProcurementDetailsID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ManufacturerId).HasColumnName("ManufacturerID");

                entity.Property(e => e.ModelNumber)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ProcurementRequestId).HasColumnName("ProcurementRequestID");

                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.RatePerQuantity).HasColumnType("money");

                entity.Property(e => e.Specifications).IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.VendorId).HasColumnName("VendorID");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.RequestForQuoteDetails)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProcurementDetails_Categories");

                entity.HasOne(d => d.Manufacturer)
                    .WithMany(p => p.RequestForQuoteDetails)
                    .HasForeignKey(d => d.ManufacturerId)
                    .HasConstraintName("FK_ProcurementDetails_Manufacturers");

                entity.HasOne(d => d.ProcurementRequest)
                    .WithMany(p => p.RequestForQuoteDetails)
                    .HasForeignKey(d => d.ProcurementRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProcurementDetails_ProcurementHeaders");

                entity.HasOne(d => d.Vendor)
                    .WithMany(p => p.RequestForQuoteDetails)
                    .HasForeignKey(d => d.VendorId)
                    .HasConstraintName("FK_RequestForQuoteDetails_Vendors");
            });

            modelBuilder.Entity<RequestForQuoteHeader>(entity =>
            {
                entity.HasKey(e => e.ProcurementRequestId)
                    .HasName("PK_ProcurementHeaders");

                entity.HasIndex(e => e.ProcurementRequestNumber, "UQ__RequestF__8559B70802C675FB")
                    .IsUnique();

                entity.Property(e => e.ProcurementRequestId)
                    .ValueGeneratedNever()
                    .HasColumnName("ProcurementRequestID");

                entity.Property(e => e.ApprovedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ApprovedOn).HasColumnType("datetime");

                entity.Property(e => e.AssociateName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Comments).IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.NetworkCompanyId).HasColumnName("NetworkCompanyID");

                entity.Property(e => e.Notes)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ProcurementRequestNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.RequestRaisedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.RequestRaisedOn).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.NetworkCompany)
                    .WithMany(p => p.RequestForQuoteHeaders)
                    .HasForeignKey(d => d.NetworkCompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProcurementHeaders_NetworkCompanies");
            });

            modelBuilder.Entity<RequestForQuoteParticipant>(entity =>
            {
                entity.HasKey(e => e.ProcurementVendorId)
                    .HasName("PK_VendorParticipation");

                entity.Property(e => e.ProcurementVendorId)
                    .ValueGeneratedNever()
                    .HasColumnName("ProcurementVendorID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ProcurementRequestId).HasColumnName("ProcurementRequestID");

                entity.Property(e => e.QuoteUploadedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.QuoteUploadedOn).HasColumnType("datetime");

                entity.Property(e => e.QutoeFilePath)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.VendorId).HasColumnName("VendorID");

                entity.HasOne(d => d.ProcurementRequest)
                    .WithMany(p => p.RequestForQuoteParticipants)
                    .HasForeignKey(d => d.ProcurementRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VendorParticipation_ProcurementHeaders");

                entity.HasOne(d => d.Vendor)
                    .WithMany(p => p.RequestForQuoteParticipants)
                    .HasForeignKey(d => d.VendorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VendorParticipation_Vendors");
            });

            modelBuilder.Entity<ScrapList>(entity =>
            {
                entity.HasKey(e => e.ScrapAssetId)
                    .HasName("PK__tmp_ms_x__268E1A27070AFFD1");

                entity.ToTable("ScrapList");

                entity.Property(e => e.ScrapAssetId).ValueGeneratedNever();

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.RefurbishedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.RefurbishedDate).HasColumnType("datetime");

                entity.Property(e => e.Remarks).IsUnicode(false);

                entity.Property(e => e.RemovedFromScrap).HasColumnName("RemovedFromScrap ");

                entity.Property(e => e.ScrappedDate).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Inventory)
                    .WithMany(p => p.ScrapLists)
                    .HasForeignKey(d => d.InventoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScrapList_Inventories");
            });

            modelBuilder.Entity<Source>(entity =>
            {
                entity.Property(e => e.SourceId)
                    .ValueGeneratedNever()
                    .HasColumnName("SourceID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.SourceName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<UserPrivilegesWithDefault>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.ToTable("UserPrivilegesWithDefault");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("UserID");

                entity.Property(e => e.UserDomainId)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("UserDomainID");

                entity.Property(e => e.UserEmailId)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("UserEmailID");

                entity.Property(e => e.UserName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UserRoleId).HasColumnName("UserRoleID");

                entity.HasOne(d => d.UserRole)
                    .WithMany(p => p.UserPrivilegesWithDefaults)
                    .HasForeignKey(d => d.UserRoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserPrivilegesWithDefault");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.RoleId);

                entity.Property(e => e.RoleId).HasColumnName("RoleID");

                entity.Property(e => e.RoleName)
                    .HasMaxLength(25)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Vendor>(entity =>
            {
                entity.Property(e => e.VendorId)
                    .ValueGeneratedNever()
                    .HasColumnName("VendorID");

                entity.Property(e => e.City)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ContactNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ContactPerson)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Country)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Gstin)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("GSTIN");

                entity.Property(e => e.State)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.VendorAddressLine1)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.VendorAddressLine2)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.VendorName)
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<VendorsCategory>(entity =>
            {
                entity.HasKey(e => new { e.VendorId, e.CategoryId });

                entity.ToTable("Vendors_Categories");

                entity.Property(e => e.VendorId).HasColumnName("VendorID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.VendorsCategories)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Vendors_Categories_Categories");

                entity.HasOne(d => d.Vendor)
                    .WithMany(p => p.VendorsCategories)
                    .HasForeignKey(d => d.VendorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Vendors_Categories_Vendors");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
