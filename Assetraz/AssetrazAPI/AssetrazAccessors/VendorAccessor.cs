using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssetrazAccessors
{
    public class VendorAccessor : AccessorCommon, IVendorAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper mapper;
        public VendorAccessor(AssetrazContext dbContext, IMapper _mapper, IHttpContextAccessor httpAccessor) : base(httpAccessor)
        {
            _dbContext = dbContext;
            mapper = _mapper;
        }
        public async Task<List<VendorDetailsDto>> GetAllVendors()
        {
            var vendors = await _dbContext.Vendors.OrderBy(i => i.VendorName).ToListAsync();
            List<VendorDetailsDto> vendorNames = mapper.Map<List<VendorDetailsDto>>(vendors);
            return vendorNames;
        }

        public async Task<List<VendorDetailsDto>> GetVendors()
        {
            var vendors = await _dbContext.Vendors.Where(v=>v.Active == true).OrderBy(i => i.VendorName).ToListAsync();
            List<VendorDetailsDto> vendorNames = mapper.Map<List<VendorDetailsDto>>(vendors);
            return vendorNames;
        }

        public async Task<List<VendorDetailsDto>> GetVendorDetails(List<Guid> vendorIds)
        {
            List<VendorDetailsDto> vendorDetailsDto = new();
            try
            {
                return await _dbContext.Vendors.Where(v => vendorIds.Contains(v.VendorId))
                    .Select(v => new VendorDetailsDto
                    {
                        VendorName = v.VendorName,
                        VendorAddressLine1 = v.VendorAddressLine1,
                        VendorAddressLine2 = v.VendorAddressLine2,
                        Gstin = v.Gstin,
                        City = v.City,
                        State = v.State,
                        Country = v.Country,
                        EmailAddress = v.EmailAddress,
                    }).ToListAsync();
            }
            catch (Exception e)
            {
                return vendorDetailsDto;
            }
        }

        public async Task<bool> AddVendor(VendorDetailsDto newVendor)
        {
            try
            {
                Vendor vendorDetail = new Vendor
                {
                    VendorId = Guid.NewGuid(),
                    VendorName = newVendor.VendorName.Trim(),
                    VendorAddressLine1 = newVendor.VendorAddressLine1,
                    VendorAddressLine2 = newVendor.VendorAddressLine2,
                    City = newVendor.City.Trim(),
                    State = newVendor.State,
                    Country = newVendor.Country,
                    Gstin = newVendor.Gstin,
                    PreferredVendor = newVendor.PreferredVendor,
                    ContactPerson = newVendor.ContactPerson.Trim(),
                    ContactNumber = newVendor.ContactNumber,
                    EmailAddress = newVendor.EmailAddress,
                    CreatedDate = DateTime.Now.ToUniversalTime(),
                    CreatedBy = LoggedInUser,
                    Active = newVendor.Active,
                    UpdatedBy = LoggedInUser,
                    UpdatedDate = DateTime.Now.ToUniversalTime(),
                };

                await _dbContext.Vendors.AddAsync(vendorDetail);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> UpdateVendor(VendorDetailsDto newVendor)
        {
            try
            {
                Vendor vendorDetail = await _dbContext.Vendors.Where(v=>v.VendorId== newVendor.VendorId).FirstOrDefaultAsync();
                if (vendorDetail != null)
                {
                    vendorDetail.VendorId = newVendor.VendorId.Value;
                    vendorDetail.VendorName = newVendor.VendorName.Trim();
                    vendorDetail.VendorAddressLine1 = newVendor.VendorAddressLine1;
                    vendorDetail.VendorAddressLine2 = newVendor.VendorAddressLine2;
                    vendorDetail.City = newVendor.City.Trim();
                    vendorDetail.State = newVendor.State;
                    vendorDetail.Country = newVendor.Country;
                    vendorDetail.Gstin = newVendor.Gstin;
                    vendorDetail.PreferredVendor = newVendor.PreferredVendor;
                    vendorDetail.ContactPerson = newVendor.ContactPerson.Trim();
                    vendorDetail.ContactNumber = newVendor.ContactNumber;
                    vendorDetail.EmailAddress = newVendor.EmailAddress;
                    vendorDetail.CreatedDate = newVendor.CreatedDate;
                    vendorDetail.CreatedBy = newVendor.CreatedBy;
                    vendorDetail.Active = newVendor.Active ?? false;
                    vendorDetail.UpdatedBy = LoggedInUser;
                    vendorDetail.UpdatedDate = DateTime.Now.ToUniversalTime();
                }
                
                _dbContext.Vendors.Update(vendorDetail);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteVendor(Guid vendorId)
        {
            bool isDeletable = !(await _dbContext.RequestForQuoteParticipants
                                .AnyAsync(r => r.VendorId == vendorId 
                                || _dbContext.RequestForQuoteDetails
                                .Any(rd => rd.VendorId == vendorId)));
            Vendor vendor = await _dbContext.Vendors.FirstOrDefaultAsync(v => v.VendorId == vendorId);
            if (isDeletable) {
                _dbContext.Vendors.Remove(vendor);
                return await _dbContext.SaveChangesAsync() > 0;
            }
            else
            {
                vendor.Active = false;
                await _dbContext.SaveChangesAsync();
                return false;
            }
        }

        public async Task<bool> HasDuplicateVendorNames(string newVendor, Guid vendorId)
        {
            string formatted = string.Join(" ", newVendor.Split((char[])null, StringSplitOptions.RemoveEmptyEntries));
            if (vendorId == Guid.Empty) {  
                return await _dbContext.Vendors.AnyAsync(v => v.VendorName == formatted);
            }
            else
            {
                return await _dbContext.Vendors.AnyAsync(v => v.VendorName == formatted && v.VendorId != vendorId);
            }
        }

        public async Task<bool> HasDuplicateVendorContactNumber(string contactNumber, Guid vendorId)
        {
            if (vendorId == Guid.Empty)
            {
                return await _dbContext.Vendors.AnyAsync(v => v.ContactNumber == contactNumber);
            }
            else
            {
                return await _dbContext.Vendors.AnyAsync(v => v.ContactNumber == contactNumber && v.VendorId != vendorId);
            }
        }
    }
}
