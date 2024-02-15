using AssetrazContracts.DTOs;

namespace AssetrazContracts.AccessorContracts
{
    public interface IManufacturerAccessor
    {
        Task<List<ManufacturerDto>> GetManufacturers();
        Task<List<ManufacturerDto>> GetAllManufacturers();
        Task<bool> AddManufacturer(ManufacturerDto manufacturer);
        Task<bool> UpdateManufacturer(ManufacturerDto manufacturer);
        bool IsDuplicateExist(string manufacturerName, Guid manufacturerId);
        Task<bool> DeleteManufacturer(Guid manufacturerId);
    }
}
