using AssetrazContracts.DTOs;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.Graph;

namespace AssetrazAccessors.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Inventory, AssetDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.NetworkCompanyName, opt => opt.MapFrom(ps => ps.PurchaseOrderRequest.NetworkCompany.CompanyName))
                .ForMember(dest => dest.IssuedBy, opt => opt.MapFrom(pa => pa.InventoryTrackRegisters.Select(r => r.CreatedBy)));
            CreateMap<RequestForQuoteHeader, ITRequestNumberDto>();
            CreateMap<RequestForQuoteHeader, RequestQuoteDto>()
                .ForMember(dest => dest.RequestNumber, opt => opt.MapFrom(ps => ps.ProcurementRequestNumber))
                .ForMember(dest => dest.NetworkCompany, opt => opt.MapFrom(ps => ps.NetworkCompany.CompanyName));
            CreateMap<PurchaseOrderHeader, PurchaseOrderDto>()
                .ForMember(dest => dest.PoDate, opt => opt.MapFrom(ps => ps.PogeneratedOn));
            CreateMap<AssetDto, Inventory>();
            CreateMap<Vendor, VendorDetailsDto>();
            CreateMap<InventoryTrackRegister, AssetTrackDto>();
            CreateMap<NetworkCompany, NetworkCompanyDto>()
                .ForMember(dest => dest.IsPrimary, opt => opt.MapFrom(ps => ps.IsPrimary));
            CreateMap<User, ADUserDto>()
                .ForMember(dest=>dest.ManagerName, opt => opt.MapFrom(ps => (ps.Manager as User).DisplayName))
                .ForMember(dest => dest.ManagerEmail, opt => opt.MapFrom(ps => (ps.Manager as User).Mail));
            //CreateMap<Inventory, InventoryDto>();
            //CreateMap<InventoryDto, Inventory>();
            CreateMap<AssetDetailsDto, Inventory>();
            CreateMap<Manufacturer, ManufacturerDto>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Source, SourceDto>();
            CreateMap<Inventory, AssetDetailsDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.PurchaseOrderNumber, opt => opt.MapFrom(ps => ps.PurchaseOrderRequest.PurchaseOrderNumber))
                .ForMember(dest => dest.RequestRaisedOn, opt => opt.MapFrom(ps => ps.PurchaseOrderRequest.RequestRaisedOn))
                .ForMember(dest => dest.WarrentyDate, opt => opt.MapFrom(ps => ps.WarrentyDate.Value.ToLocalTime()));


            CreateMap<PurchaseRequest, PurchaseRequestDto>()
                .ForMember(dest => dest.AssociateName, opt => opt.MapFrom(s => s.EmployeeName))
                .ForMember(dest => dest.AdminComments, opt => opt.MapFrom(s => s.AdminComments))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(s => s.Category.CategoryName));

            CreateMap<Invoice, PurchaseInvoiceDto>()
                .ForMember(dest => dest.PurchaseOrderNumber, opt => opt.MapFrom(s => s.PurchaseOrderRequest.PurchaseOrderNumber))
                .ForMember(dest => dest.RequestRaisedOn, opt => opt.MapFrom(s => s.PurchaseOrderRequest.RequestRaisedOn))
                .ForMember(dest => dest.VendorName, opt => opt.MapFrom(s => s.PurchaseOrderRequest.Vendor.VendorName));

            CreateMap<RequestForQuoteParticipant, RequestQuoteDto>()
                .ForMember(dest => dest.RequestNumber, opt => opt.MapFrom(s => s.ProcurementRequest.ProcurementRequestNumber))
                .ForMember(dest => dest.QuoteReceivedOn, opt => opt.MapFrom(s => s.QuoteUploadedOn))
                .ForMember(dest => dest.RequestRaisedOn, opt => opt.MapFrom(s => s.ProcurementRequest.RequestRaisedOn))
                .ForMember(dest => dest.ApprovedOn, opt => opt.MapFrom(s => s.ProcurementRequest.ApprovedOn))
                .ForMember(dest => dest.ApprovedBy, opt => opt.MapFrom(s => s.ProcurementRequest.ApprovedBy))
                .ForMember(dest => dest.VendorName, opt => opt.MapFrom(s => s.Vendor.VendorName));

            CreateMap<RequestForQuoteDetail, RequestForQuoteDetailsDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Manufacturer.ManufacturerName));

            CreateMap<PurchaseOrderDetail, RequestForQuoteDetailsDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Manufacturer.ManufacturerName));

            CreateMap<PurchaseOrderDetail, PurchaseOrderDetailsDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.PurchaseOrderRequestId, opt => opt.MapFrom(ps => ps.PurchaseOrderRequest.PurchaseOrderRequestId))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Manufacturer.ManufacturerName));

            CreateMap<RefurbishedAsset, RefurbishedAssetDto>()
                .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(ps => ps.InventoryId))
                .ForMember(dest => dest.RefurbishAssetId, opt => opt.MapFrom(ps => ps.RefurbishAssetId))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Inventory.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Inventory.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.ModelNumber, opt => opt.MapFrom(ps => ps.Inventory.ModelNumber))
                .ForMember(dest => dest.WarrentyDate, opt => opt.MapFrom(ps => ps.Inventory.WarrentyDate))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(ps => ps.Inventory.SerialNumber))
                .ForMember(dest => dest.AssetTagNumber, opt => opt.MapFrom(ps => ps.Inventory.AssetTagNumber))
                .ForMember(dest => dest.RefurbishedDate, opt => opt.MapFrom(ps => ps.RefurbishedDate))
                .ForMember(dest => dest.ReturnedBy, opt => opt.MapFrom(ps => ps.CreatedBy))
                .ForMember(dest => dest.ReturnDate, opt => opt.MapFrom(ps => ps.ReturnedDate))
                .ForMember(dest => dest.Issuable, opt => opt.MapFrom(ps => ps.Inventory.Issuable))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(ps => ps.Status))
                .ForMember(dest => dest.Remarks, opt => opt.MapFrom(ps => ps.Remarks));

            CreateMap<InventoryTrackRegister, AssetDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Inventory.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Inventory.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(ps => ps.Inventory.InventoryId))
                .ForMember(dest => dest.ModelNumber, opt => opt.MapFrom(ps => ps.Inventory.ModelNumber))
                .ForMember(dest => dest.WarrentyDate, opt => opt.MapFrom(ps => ps.Inventory.WarrentyDate))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(ps => ps.Inventory.SerialNumber))
                .ForMember(dest => dest.AssetTagNumber, opt => opt.MapFrom(ps => ps.Inventory.AssetTagNumber))
                .ForMember(dest => dest.AssetStatus, opt => opt.MapFrom(ps => ps.Inventory.AssetStatus));

            CreateMap<RequestForQuoteParticipant, RequestForQuoteParticipantDto>()
                .ForMember(dest => dest.VendorName, opt => opt.MapFrom(ps => ps.Vendor.VendorName))
                .ForMember(dest => dest.VendorEmail, opt => opt.MapFrom(ps => ps.Vendor.EmailAddress))
                .ForMember(dest => dest.QuoteReceivedOn, opt => opt.MapFrom(s => s.QuoteUploadedOn));

            CreateMap<InsuranceItem, AssetInsuranceDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Inventory.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Inventory.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.PurchaseOrderNumber, opt => opt.MapFrom(ps => ps.Inventory.PurchaseOrderRequest.PurchaseOrderNumber))
                .ForMember(dest => dest.PogeneratedOn, opt => opt.MapFrom(ps => ps.Inventory.PurchaseOrderRequest.PogeneratedOn))
                .ForMember(dest => dest.ModelNumber, opt => opt.MapFrom(ps => ps.Inventory.ModelNumber))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(ps => ps.Inventory.SerialNumber))
                .ForMember(dest => dest.WarrentyDate, opt => opt.MapFrom(ps => ps.Inventory.WarrentyDate))
                .ForMember(dest => dest.AssetValue, opt => opt.MapFrom(ps => ps.Inventory.AssetValue))
                .ForMember(dest => dest.AssetTagNumber, opt => opt.MapFrom(ps => ps.Inventory.AssetTagNumber))
                .ForMember(dest => dest.NetworkCompanyName, opt => opt.MapFrom(ps => ps.Inventory.PurchaseOrderRequest.NetworkCompany.CompanyName));


            CreateMap<ScrapList, ScrapListDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Inventory.Category.CategoryName))
                .ForMember(dest => dest.ManufacturerName, opt => opt.MapFrom(ps => ps.Inventory.Manufacturer.ManufacturerName))
                .ForMember(dest => dest.ModelNumber, opt => opt.MapFrom(ps => ps.Inventory.ModelNumber))
                .ForMember(dest => dest.SerialNumber, opt => opt.MapFrom(ps => ps.Inventory.SerialNumber))
                .ForMember(dest => dest.WarrentyDate, opt => opt.MapFrom(ps => ps.Inventory.WarrentyDate))
                .ForMember(dest => dest.AssetTagNumber, opt => opt.MapFrom(ps => ps.Inventory.AssetTagNumber))
                .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(ps => ps.Inventory.InventoryId))
                .ForMember(dest => dest.ScrappedDate, opt => opt.MapFrom(ps => ps.CreatedDate))
                .ForMember(dest => dest.MarkedBy, opt => opt.MapFrom(ps => ps.CreatedBy));

            CreateMap<ReOrderLevel, ReOrderLevelsDto>()
                .ForMember(dest => dest.ReOrderLevel, opt => opt.MapFrom(ps => ps.ReOrderLevel1))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(ps => ps.Category.CategoryName))
                .ForMember(dest => dest.NetworkCompanyName, opt => opt.MapFrom(ps => ps.NetworkCompany.CompanyName));

        }
    }
}

