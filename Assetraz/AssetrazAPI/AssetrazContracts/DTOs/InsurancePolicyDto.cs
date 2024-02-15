using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class InsurancePolicyDto
    {
        public Guid ReferenceNumber { get; set; }
        public IFormFile? PolicyFile { get; set; }
        public string? PolicyFilePath { get; set; }
        public string? FileName
        {
            get
            {
                return PolicyFilePath != null ? PolicyFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
    }
}
