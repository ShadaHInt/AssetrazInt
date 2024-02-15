using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Exceptions;
using AssetrazContracts.ManagerContracts;

namespace AssetrazManagers
{
    public class VendorManager : IVendorManager
    {
        private IVendorAccessor _vendorAccessor;
        public VendorManager(IVendorAccessor vendorAccessor)
        {
            _vendorAccessor = vendorAccessor;
        }

        public async Task<List<VendorDetailsDto>> GetAllVendors()
        {
            return await _vendorAccessor.GetAllVendors();
        }

        public async Task<List<VendorDetailsDto>> GetVendors()
        {
            return await _vendorAccessor.GetVendors();
        }

        public async Task<bool> AddVendor(VendorDetailsDto newVendor)
        {
            var hasDuplicateVendorName = await _vendorAccessor.HasDuplicateVendorNames(newVendor.VendorName, Guid.Empty);
            var hasDuplicateContactNumber = await _vendorAccessor.HasDuplicateVendorContactNumber(newVendor.ContactNumber, Guid.Empty);
            if (hasDuplicateVendorName)
            {
                throw new DuplicateVendorNameException("Duplicate vendor name found in DB!");
            }
            if (hasDuplicateContactNumber)
            {
                throw new DuplicateContactNumberException("Duplicate contact found in DB!");
            }
            else
            {
                newVendor.VendorName = string.Join(" ", newVendor.VendorName.Split((char[])null, StringSplitOptions.RemoveEmptyEntries));
                return await _vendorAccessor.AddVendor(newVendor);
            }
        }

        public async Task<bool> UpdateVendor(VendorDetailsDto newVendor)
        {
            var hasDuplicateVendorName = await _vendorAccessor.HasDuplicateVendorNames(newVendor.VendorName, newVendor.VendorId.Value);
            var hasDuplicateContactNumber = await _vendorAccessor.HasDuplicateVendorContactNumber(newVendor.ContactNumber, newVendor.VendorId.Value);
            if (hasDuplicateVendorName)
            {
                throw new DuplicateVendorNameException("Duplicate vendor name found in DB!");
            }
            if(hasDuplicateContactNumber)
            {
                throw new DuplicateContactNumberException("Duplicate contact found in DB!");
            }
            else
            {
                newVendor.VendorName = string.Join(" ", newVendor.VendorName.Split((char[])null, StringSplitOptions.RemoveEmptyEntries));
                return await _vendorAccessor.UpdateVendor(newVendor);
            }
        }

        public async Task<bool> DeleteVendor(Guid vendorId)
        {
            return await _vendorAccessor.DeleteVendor(vendorId);
        }
    }
}
