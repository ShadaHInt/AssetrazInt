using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IVendorManager
    {
        Task<List<VendorDetailsDto>> GetAllVendors();
        Task<List<VendorDetailsDto>> GetVendors();
        Task<bool> AddVendor(VendorDetailsDto newVendor);
        Task<bool> UpdateVendor(VendorDetailsDto newVendor);
        Task<bool> DeleteVendor(Guid vendorId);
    }
}
