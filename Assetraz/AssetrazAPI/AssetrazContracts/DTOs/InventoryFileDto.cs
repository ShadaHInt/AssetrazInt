using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class InventoryFileDto
    {

        public Guid? InventoryOtherSourceId { get; set; }
        public IFormFile? SupportingDocumentFile { get; set; }
        public string? SupportingDocumentFilePath { get; set; }
        public string? FileName
        {
            get
            {
                return SupportingDocumentFilePath != null ? SupportingDocumentFilePath.Split("/").LastOrDefault() : String.Empty;
            }
        }
    }
}
