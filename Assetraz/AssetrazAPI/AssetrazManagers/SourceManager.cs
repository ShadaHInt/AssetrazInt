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
    public class SourceManager : ISourceManager
    {
        private ISourceAccessor _sourceAccessor;
        private IAssetsAccessor _assetsAccessor;

        public SourceManager(IAssetsAccessor assetsAccessor, ISourceAccessor sourceAccessor)
        {
            _assetsAccessor = assetsAccessor;
            _sourceAccessor = sourceAccessor;
        }

        public async Task<List<SourceDto>> GetSources()
        {
            return await _sourceAccessor.GetSources();
        }

        public async Task<List<SourceDto>> GetAllSources()
        {
            return await _sourceAccessor.GetAllSources();
        }

        public async Task<bool> AddSource(SourceDto newSource)
        {
            var trimmedSourceName = string.Join(" ", newSource.SourceName.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
            var sources = _sourceAccessor.GetSourceNames();
            var source = sources.ConvertAll(c => c?.ToUpper()).Contains(trimmedSourceName.ToUpper());

            if (source == false)
            {
                return await _sourceAccessor.AddSource(newSource);
            }
            else
            {
                throw new DuplicateException("A source with same name already exists");
            }
        }

        public async Task<bool> UpdateSource(SourceDto updatedSource)
        {
            var trimmedSourceName = string.Join(" ", updatedSource.SourceName.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
            updatedSource.SourceName = trimmedSourceName;
            var currentSourceName = _sourceAccessor.GetSourceById(updatedSource.SourceId).SourceName;
            var filteredCategories = _sourceAccessor.GetSourceNames().Where(i => i != currentSourceName).ToList();
            var isExistSource = filteredCategories.ConvertAll(c => c.ToUpper()).Contains(updatedSource.SourceName.ToUpper());
            if (isExistSource == false)
            {
                return await _sourceAccessor.UpdateSource(updatedSource);
            }
            else
            {
                throw new DuplicateException("A source with same name already exists");
            }
        }

        public async Task<bool> DeleteSource(Guid sourceId)
        {
            return await _sourceAccessor.DeleteSource(sourceId);      
        }
    }
}
