using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.ManagerContracts
{
    public interface IInsuranceManager
    {
        Task<List<AssetInsuranceDto>> GetInsuredAssets();
        Task<bool> UpdateInsurance(List<AssetInsuranceDto> updatedData);
        Task<List<AssetInsuranceDto>> GetInsuranceDetails(List<Guid> insuranceReferenceIds);
        Task<bool> UploadInsurancePolicy(InsurancePolicyDto insurancePolicy);
        Task<(Stream, string, string)> DownloadInsurancePolicy(Guid referenceNumber);

        Task<bool> DeleteInsurancePolicy(Guid referenceNumber);
    }
}
