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
    public class ManufacturerAccessor : AccessorCommon, IManufacturerAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper mapper;
        public ManufacturerAccessor(AssetrazContext dbContext, IMapper _mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _dbContext = dbContext;
            mapper = _mapper;
        }

        public async Task<List<ManufacturerDto>> GetManufacturers()
        {
            var manufacturers = await _dbContext.Manufacturers
                .Where(i => i.Active)
                .OrderBy(i => i.ManufacturerName)
                .ToListAsync();
            List<ManufacturerDto> manufacturerNames = mapper.Map<List<ManufacturerDto>>(manufacturers);
            return manufacturerNames;
        }

        public async Task<List<ManufacturerDto>> GetAllManufacturers()
        {
            var manufacturers = await _dbContext.Manufacturers
                .OrderBy(i => i.ManufacturerName)
                .ToListAsync();
            List<ManufacturerDto> manufacturerNames = mapper.Map<List<ManufacturerDto>>(manufacturers);
            return manufacturerNames;
        }

        public async Task<bool> AddManufacturer(ManufacturerDto manufacturer)
        {
            Manufacturer newManufacturer = new()
            {
                ManfacturerId = Guid.NewGuid(),
                ManufacturerName = manufacturer.ManufacturerName,
                PreferredManufacturer = manufacturer.PreferredManufacturer,
                Active = manufacturer.Active,
                CreatedBy = LoggedInUser,
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedBy = LoggedInUser,
                UpdatedDate = DateTime.Now.ToUniversalTime(),
            };
            _dbContext.Manufacturers.Add(newManufacturer);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateManufacturer(ManufacturerDto manufacturer)
        {

            Manufacturer manufacturerDetails = await _dbContext.Manufacturers.FindAsync(manufacturer.ManfacturerId);
            if (manufacturerDetails == null)
            {
                return false;
            }

            manufacturerDetails.ManufacturerName = manufacturer.ManufacturerName;
            manufacturerDetails.PreferredManufacturer = manufacturer.PreferredManufacturer;
            manufacturerDetails.Active = manufacturer.Active;
            manufacturerDetails.UpdatedBy = LoggedInUser;
            manufacturerDetails.UpdatedDate = DateTime.Now.ToUniversalTime();

            _dbContext.Manufacturers.Update(manufacturerDetails);
            return await _dbContext.SaveChangesAsync() > 0;

        }

        public bool IsDuplicateExist(string manufacturerName, Guid manfacturerId)
        {
            bool isExist;
            if (manfacturerId == Guid.Empty)
            {
                isExist = _dbContext.Manufacturers
                .Any(m => m.ManufacturerName.ToLower() == manufacturerName.ToLower());
            }
            else
            {
                isExist = _dbContext.Manufacturers
                .Any(m => m.ManufacturerName.ToLower() == manufacturerName.ToLower() && m.ManfacturerId != manfacturerId);
            }

            return isExist;
        }

        public async Task<bool> DeleteManufacturer(Guid manufacturerId)
        {
            var manufacturer = await _dbContext.Manufacturers.FirstOrDefaultAsync(m => m.ManfacturerId == manufacturerId);
            if (manufacturer != null)
            {
                bool isDeletable = !(await _dbContext.Inventories.AnyAsync(i => i.ManufacturerId == manufacturerId)
                                    || await _dbContext.PurchaseOrderDetails.AnyAsync(po => po.ManufacturerId == manufacturerId)
                                    || await _dbContext.RequestForQuoteDetails.AnyAsync(rq => rq.ManufacturerId == manufacturerId));

                if (isDeletable)
                {
                    _dbContext.Manufacturers.Remove(manufacturer);
                }
                else
                {
                    manufacturer.Active = false;
                }
                await _dbContext.SaveChangesAsync();
                return isDeletable;
            }
            else
            {
                return false;
            }
        }
    }

}
