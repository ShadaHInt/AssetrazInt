using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.AccessorContracts
{
    public interface ISourceAccessor
    {
        Task<List<SourceDto>> GetSources();
        Task<List<SourceDto>> GetAllSources();
        Task<bool> AddSource(SourceDto newSource);
        public List<string?> GetSourceNames();
        SourceDto GetSourceById(Guid sourceId);
        Task<bool> UpdateSource(SourceDto updatedSource);
        Task<bool> DeleteSource(Guid sourceId);
        Task<bool> IsSourceIDReferred(Guid sourceId);
    }
}
