using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazAccessors
{
    public class SourceAccessor : AccessorCommon,ISourceAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper _mapper;
        public SourceAccessor(AssetrazContext dbContext, IMapper mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<SourceDto>> GetSources()
        {
            var sources = await _dbContext.Sources.Where(c => c.Active == true).OrderBy(c => c.SourceName).ToListAsync();
            List<SourceDto> sourceNames = _mapper.Map<List<SourceDto>>(sources);
            return sourceNames;
        }

        public List<string?> GetSourceNames()
        {
            List<string?> existingSources = _dbContext.Sources.Select(c => c.SourceName).ToList();
            return existingSources;
        }

        public async Task<List<SourceDto>> GetAllSources()
        {
            var allSources = await _dbContext.Sources.OrderBy(c => c.SourceName).ToListAsync();
            List<SourceDto> sources = _mapper.Map<List<SourceDto>>(allSources);
            return sources;
        }

        public SourceDto GetSourceById(Guid sourceId)
        {
            Source existingSource = _dbContext.Sources.FirstOrDefault(s => s.SourceId == sourceId);
            SourceDto source = _mapper.Map<SourceDto>(existingSource);

            return source;
        }

        public async Task<bool> AddSource(SourceDto newSource)
        {
            Source source = new()
            {
                SourceId = Guid.NewGuid(),
                SourceName = newSource.SourceName,
                Active = newSource.Active,
                CreatedBy = LoggedInUser,
                UpdatedBy = LoggedInUser,
                CreatedDate = DateTime.Now.ToUniversalTime(),
                UpdatedDate = DateTime.Now.ToUniversalTime()
            };
            _dbContext.Sources.Add(source);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateSource(SourceDto updatedSource)
        {
            Source selectedSource = await _dbContext.Sources.FirstOrDefaultAsync(c => c.SourceId == updatedSource.SourceId);
            selectedSource.SourceName = updatedSource.SourceName;
            selectedSource.Active = updatedSource.Active;
            selectedSource.UpdatedBy = LoggedInUser;
            selectedSource.UpdatedDate = DateTime.Now.ToUniversalTime();

            _dbContext.Sources.Update(selectedSource);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteSource(Guid sourceId)
        {
            bool isReferred = await IsSourceIDReferred(sourceId);
            Source source = await _dbContext.Sources.FirstOrDefaultAsync(c => c.SourceId == sourceId);
            if(source == null)
            {
                return false;
            }

            if (isReferred)
            {
                source.Active = false;
                _dbContext.Update(source);
            }
            else
            {
                _dbContext.Sources.Remove(source);
            }

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> IsSourceIDReferred(Guid sourceId)
        {
            bool isReferred;
            isReferred = await _dbContext.InventoriesOtherSourcesHeaders.AnyAsync(i => i.SourceId.Equals(sourceId));
            return isReferred;
        }
    }
}

