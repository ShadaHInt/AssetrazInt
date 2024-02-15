using AssetrazContracts.DTOs;

namespace AssetrazContracts.ManagerContracts
{
    public interface IManufacturerManager
    {
        Task<List<ManufacturerDto>> GetManufacturers();
        Task<List<ManufacturerDto>> GetAllManufacturers();
        Task<bool> AddManufacturer(ManufacturerDto manufacturer);
        Task<bool> UpdateManufacturer(ManufacturerDto manufacturer);
        Task<bool> DeleteManufacturer(Guid manufacturerId);
    }
}
