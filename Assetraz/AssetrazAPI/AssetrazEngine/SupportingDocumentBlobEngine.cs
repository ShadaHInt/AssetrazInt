using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Others;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazEngine
{
    public class SupportingDocumentBlobEngine : ISupportDocumentBlobEngine
    {
        private readonly IBlobEngine _blobEngine;
        private const StorageAccountContainer _otherSourceInventoryContainer = StorageAccountContainer.InventoryDocument;

        public SupportingDocumentBlobEngine(IBlobEngine blobEngine)
        {
            _blobEngine = blobEngine;
        }

        public async Task<bool> UploadSupportDocument(InventoryFileDto inventoryFileDto)
        {
            string fileName = $"{inventoryFileDto.InventoryOtherSourceId}/{inventoryFileDto.SupportingDocumentFile.FileName}";

            inventoryFileDto.SupportingDocumentFilePath = fileName;

            return await _blobEngine.UploadBlob(_otherSourceInventoryContainer, fileName, inventoryFileDto.SupportingDocumentFile);
        }

        public async Task<(Stream, string)> DownloadSupportDocument(string filePath)
        {
            return await _blobEngine.DownloadBlob(_otherSourceInventoryContainer, filePath);
        }

        public async Task<bool> DeleteSupportDocument(string filePath)
        {
            return await _blobEngine.DeleteBlob(_otherSourceInventoryContainer, filePath);
        }
    }
}
