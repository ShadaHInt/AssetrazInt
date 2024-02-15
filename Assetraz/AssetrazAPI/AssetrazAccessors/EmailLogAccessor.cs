using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazAccessors
{
    public class EmailLogAccessor : AccessorCommon, IEmailLogAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper mapper;
        public EmailLogAccessor(AssetrazContext dbContext, IMapper _mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _dbContext = dbContext;
            mapper = _mapper;
        }

        public async Task<bool> AddEmailLog(EmailLogDto newEmailLog)
        {
            EmailLog emailLog = new()
            {
                LogId = Guid.NewGuid(),
                Message = newEmailLog.Message,
                ToList = newEmailLog.ToList,
                CcList = newEmailLog.CcList,
                CreatedOn = DateTime.Now.ToUniversalTime()
            };

            _dbContext.EmailLogs.Add(emailLog);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddEmailLog(string message, string toList, string ccList)
        {
            EmailLog emailLog = new()
            {
                LogId = Guid.NewGuid(),
                Message = message,
                ToList = toList,
                CcList = ccList,
                CreatedOn = DateTime.Now.ToUniversalTime()
            };

            _dbContext.EmailLogs.Add(emailLog);

            return await _dbContext.SaveChangesAsync() > 0;
        }

    }
}
