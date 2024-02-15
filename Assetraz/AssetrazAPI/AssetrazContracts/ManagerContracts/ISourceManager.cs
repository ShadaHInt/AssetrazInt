using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.ManagerContracts
{
    public interface ISourceManager
    {
        Task<List<SourceDto>> GetSources();
        Task<List<SourceDto>> GetAllSources();
        Task<bool> AddSource(SourceDto newSource);
        Task<bool> UpdateSource(SourceDto updatedSource);
        Task<bool> DeleteSource(Guid sourceId);
    }
}
