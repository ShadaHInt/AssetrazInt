using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IVendorAccessor
    {
        Task<List<VendorDetailsDto>> GetAllVendors();
        Task<List<VendorDetailsDto>> GetVendors();
        Task<List<VendorDetailsDto>> GetVendorDetails(List<Guid> vendorIds);
        Task<bool> AddVendor(VendorDetailsDto newVendor);
        Task<bool> HasDuplicateVendorNames(string newVendor, Guid vendorId);
        Task<bool> UpdateVendor(VendorDetailsDto newVendor);
        Task<bool> DeleteVendor(Guid vendorId);
        Task<bool> HasDuplicateVendorContactNumber(string contactNumber, Guid vendorId);
    }
}
