using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.AccessorContracts
{
    public interface IInsuranceAccessor
    {
        Task<List<AssetInsuranceDto>> GetInsuredAssets();
        Task<bool> UpdateInsurance(List<AssetInsuranceDto> updatedData);
        Task<List<AssetInsuranceDto>> GetInsuranceDetails(List<Guid> insuranceReferenceIds);
        Task<bool> UpdateInsuranceDetails(InsurancePolicyDto insurancePolicy);
        Task<bool> DeleteInsurancePolicy(Guid referenceNumber);
        Task<string> GetBlobFilePath(Guid referenceNumber);
    }
}
