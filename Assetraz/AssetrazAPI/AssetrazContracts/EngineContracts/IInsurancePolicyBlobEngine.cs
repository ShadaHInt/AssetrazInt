using AssetrazContracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.EngineContracts
{
    public interface IInsurancePolicyBlobEngine
    {
        Task<bool> UploadInsurancePolicy(InsurancePolicyDto insurancePolicy);
        Task<(Stream, string)> DownloadInsurancePolicy(string filePath);

        Task<bool> DeleteInsurancePolicy(string filePath);
    }
}
