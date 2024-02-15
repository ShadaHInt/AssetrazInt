using AssetrazAccessors;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.EngineContracts;
using AssetrazContracts.ManagerContracts;
using AssetrazEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazManagers
{
    public class InsuranceManager : IInsuranceManager
    {
        private IInsuranceAccessor _insuranceAccessor;
        private readonly IInsurancePolicyBlobEngine _insurancePolicyBlobEngine;
        public InsuranceManager(IInsuranceAccessor insuranceAccessor, IInsurancePolicyBlobEngine insurancePolicyBlobEngine)
        {
            _insuranceAccessor = insuranceAccessor;
            _insurancePolicyBlobEngine = insurancePolicyBlobEngine;
        }

        public async Task<List<AssetInsuranceDto>> GetInsuranceDetails(List<Guid> insuranceReferenceIds)
        {
            return await _insuranceAccessor.GetInsuranceDetails(insuranceReferenceIds);
        }

        public async Task<List<AssetInsuranceDto>> GetInsuredAssets()
        {
            return await _insuranceAccessor.GetInsuredAssets();
        }

        public async Task<bool> UpdateInsurance(List<AssetInsuranceDto> updatedData)
        {
            return await _insuranceAccessor.UpdateInsurance(updatedData);
        }

        public async Task<bool> UploadInsurancePolicy(InsurancePolicyDto insurancePolicy)
        {
            var response = await _insurancePolicyBlobEngine.UploadInsurancePolicy(insurancePolicy);
            if (response)
                return await _insuranceAccessor.UpdateInsuranceDetails(insurancePolicy);

            return false;
        }

        public async Task<(Stream, string, string)> DownloadInsurancePolicy(Guid referenceNumber)
        {
            string filePath = await _insuranceAccessor.GetBlobFilePath(referenceNumber);
            string fileName = filePath.Split("/").LastOrDefault();

            var result = await _insurancePolicyBlobEngine.DownloadInsurancePolicy(filePath);

            return (result.Item1, result.Item2, fileName);
        }

        public async Task<bool> DeleteInsurancePolicy(Guid referenceNumber)
        {
            string filePath = await _insuranceAccessor.GetBlobFilePath(referenceNumber);
            var response = await _insurancePolicyBlobEngine.DeleteInsurancePolicy(filePath);

            if (response)
                return await _insuranceAccessor.DeleteInsurancePolicy(referenceNumber);

            return false;
        }
    }
}
