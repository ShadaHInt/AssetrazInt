using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.AccessorContracts
{
    public interface IReorderLevelAccessor
    {
        Task<List<ReOrderLevelsDto>> GetReOrderLevels(Guid networkCompanyId);
        Task<bool> UpdateReOrderLevels(List<ReOrderLevelsDto> reOrderLevelDtoList);
        Task<bool> AddReOrderLevels(List<ReOrderLevelsDto> reOrderLevelDtoList);
    }
}
