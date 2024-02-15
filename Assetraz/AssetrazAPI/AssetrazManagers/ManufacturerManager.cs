using AssetrazAccessors;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Exceptions;
using AssetrazContracts.ManagerContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazManagers
{
    public class ManufacturerManager : IManufacturerManager
    {
        private IManufacturerAccessor _manufacturerAccessor;
        public ManufacturerManager(IManufacturerAccessor manufacturerAccessor)
        {
            _manufacturerAccessor = manufacturerAccessor;
        }
        public async Task<List<ManufacturerDto>> GetManufacturers()
        {
            return await _manufacturerAccessor.GetManufacturers();
        }

        public async Task<List<ManufacturerDto>> GetAllManufacturers()
        {
            return await _manufacturerAccessor.GetAllManufacturers();
        }

        public async Task<bool> AddManufacturer(ManufacturerDto manufacturer)
        {
            bool isManufacturereExists = _manufacturerAccessor.IsDuplicateExist(manufacturer.ManufacturerName, manufacturer.ManfacturerId);
            if (!isManufacturereExists) 
            {
                return await _manufacturerAccessor.AddManufacturer(manufacturer);
            }
            else
            {
                throw new DuplicateException("A manufacturer with same name exists");
            }
        }
        public async Task<bool> UpdateManufacturer(ManufacturerDto manufacturer)
        {
            bool isManufacturereExists = _manufacturerAccessor.IsDuplicateExist(manufacturer.ManufacturerName, manufacturer.ManfacturerId);
            if (!isManufacturereExists)
            {
                return await _manufacturerAccessor.UpdateManufacturer(manufacturer);
            }
            else
            {
                throw new DuplicateException("A manufacturer with same name exists");
            }
        }

        public async Task<bool> DeleteManufacturer(Guid manufacturerId)
        {
            return await _manufacturerAccessor.DeleteManufacturer(manufacturerId);
        }

    }
}
