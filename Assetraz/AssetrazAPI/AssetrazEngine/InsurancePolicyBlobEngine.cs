using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.Others;
using Azure.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazEngine
{
    public class InsurancePolicyBlobEngine : IInsurancePolicyBlobEngine
    {
        private readonly IBlobEngine _blobEngine;
        private const StorageAccountContainer _insuranceContainer = StorageAccountContainer.Insurance;

        public InsurancePolicyBlobEngine(IBlobEngine blobEngine)
        {
            _blobEngine = blobEngine;
        }

        public async Task<bool> UploadInsurancePolicy(InsurancePolicyDto insurancePolicy)
        {
            string fileName = $"{insurancePolicy.ReferenceNumber}/{insurancePolicy.PolicyFile.FileName}";

            await _blobEngine.UploadBlob(_insuranceContainer, fileName, insurancePolicy.PolicyFile);

            insurancePolicy.PolicyFilePath = fileName;

            return true;
        }

        public async Task<(Stream, string)> DownloadInsurancePolicy(string filePath)
        {
            return await _blobEngine.DownloadBlob(_insuranceContainer, filePath);
        }

        public async Task<bool> DeleteInsurancePolicy(string filePath)
        {
            return await _blobEngine.DeleteBlob(_insuranceContainer, filePath);
        }
    }
}
