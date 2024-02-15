using AssetrazAccessors.Common;
using AssetrazContracts.AccessorContracts;
using AssetrazContracts.DTOs;
using AssetrazContracts.Enums;
using AssetrazDataProvider;
using AssetrazDataProvider.Entities;
using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace AssetrazAccessors
{
    public class InsuranceAccessor : AccessorCommon,IInsuranceAccessor
    {
        private AssetrazContext _dbContext;
        private readonly IMapper _mapper;
        public InsuranceAccessor(AssetrazContext dbContext, IMapper mapper, IHttpContextAccessor httpAccessor) : base(httpAccessor)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<AssetInsuranceDto>> GetInsuredAssets()
        {
            var insuredAssets = await (
                from i in _dbContext.Inventories
                join n in _dbContext.InsuranceItems on i.InventoryId equals n.InventoryId 
                join t in _dbContext.PurchaseOrderHeaders on i.PurchaseOrderRequestId equals t.PurchaseOrderRequestId into grp
                from t in grp.DefaultIfEmpty()
                join v in _dbContext.Invoices on t.PurchaseOrderRequestId equals v.PurchaseOrderRequestId into invGrp
                from v in invGrp.DefaultIfEmpty()
                join nc in _dbContext.NetworkCompanies on i.NetworkCompanyId equals nc.NetworkCompanyId into ncGrp
                from nc in ncGrp.DefaultIfEmpty()
                select new AssetInsuranceDto
                                {
                                    InsuranceReferenceId = n.InsuranceReferenceId,
                                    PurchaseOrderNumber = t.PurchaseOrderNumber,
                                    InvoiceNumber = v.InvoiceNumber,
                                    CategoryName = i.Category.CategoryName,
                                    ManufacturerName = i.Manufacturer.ManufacturerName,
                                    ModelNumber = i.ModelNumber,
                                    WarrentyDate = i.WarrentyDate,
                                    SerialNumber = i.SerialNumber,
                                    AssetValue = i.AssetValue,
                                    ReferenceNumber = n.ReferenceNumber,
                                    Status = n.Status,
                                    NetworkCompanyName = nc.CompanyName,
                                }).OrderBy(c => c.PurchaseOrderNumber).ToListAsync();

            var insuredItems = _mapper.Map<List<AssetInsuranceDto>>(insuredAssets);
            return insuredItems;
        }

        public async Task<bool> UpdateInsurance(List<AssetInsuranceDto> updatedData)
        {
            var updateInsuranceReferenceIds = updatedData.Select(u=> u.InsuranceReferenceId).ToList();
            List<InsuranceItem> insuranceItems = await _dbContext.InsuranceItems.Where(ins => updateInsuranceReferenceIds.Contains(ins.InsuranceReferenceId)).ToListAsync();
            var newReferenceNumber = Guid.NewGuid();

            foreach (var referenceId in updatedData.Select(c => c.InsuranceReferenceId))
            {
                var insuranceItem = insuranceItems.FirstOrDefault(c => c.InsuranceReferenceId == referenceId);
                
                if (insuranceItem.ReferenceNumber != null)
                {
                    insuranceItem.InsuranceOffice = updatedData.First().InsuranceOffice;
                    insuranceItem.PolicyNumber = updatedData.First().PolicyNumber;
                    insuranceItem.PolicyStartDate = updatedData.First().PolicyStartDate;
                    insuranceItem.PolicyEndDate = updatedData.First().PolicyEndDate;
                    insuranceItem.Status = updatedData.First().Status;
                    insuranceItem.UpdatedDate = DateTime.Now.ToUniversalTime();
                    insuranceItem.UpdatedBy = LoggedInUser;
                }

                else
                {
                    insuranceItem.InsuranceOffice = updatedData.First().InsuranceOffice;
                    insuranceItem.ReferenceNumber = newReferenceNumber;
                    insuranceItem.Status = updatedData.First().Status;
                    insuranceItem.UpdatedDate = DateTime.Now.ToUniversalTime();
                    insuranceItem.UpdatedBy = LoggedInUser;
                }
            }

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<AssetInsuranceDto>> GetInsuranceDetails(List<Guid> insuranceReferenceIds)
        {
            var insuredAssets = await (from i in _dbContext.InsuranceItems
                                       join n in _dbContext.Inventories on i.InventoryId equals n.InventoryId
                                       join c in _dbContext.Categories on n.CategoryId equals c.CategoryId
                                       join m in _dbContext.Manufacturers on n.ManufacturerId equals m.ManfacturerId
                                       join poh in _dbContext.PurchaseOrderHeaders on n.PurchaseOrderRequestId equals poh.PurchaseOrderRequestId into pohJoin
                                       from poh in pohJoin.DefaultIfEmpty()
                                       join inv in _dbContext.Invoices on (n.PurchaseOrderRequestId != null ? n.PurchaseOrderRequestId : n.InventoryId) equals (inv.PurchaseOrderRequestId != null ? inv.PurchaseOrderRequestId : inv.InventoryId) into invoiceJoin
                                       from inv in invoiceJoin.DefaultIfEmpty()
                                       join oth in _dbContext.InventoriesOtherSourcesHeaders on n.InventoryOtherSourceId equals oth.InventoryOtherSourceId into othJoin
                                       from oth in othJoin.DefaultIfEmpty()
                                       where insuranceReferenceIds.Contains(i.InsuranceReferenceId)
                                       select new AssetInsuranceDto
                                        {
                                            InsuranceReferenceId = i.InsuranceReferenceId,
                                            InsuranceOffice = i.InsuranceOffice,
                                            PolicyNumber = i.PolicyNumber,
                                            PolicyStartDate = i.PolicyStartDate,
                                            PolicyEndDate = i.PolicyEndDate,
                                            ReferenceNumber = i.ReferenceNumber,
                                            Status = i.Status,
                                            CategoryName = c.CategoryName,
                                            ManufacturerName = m.ManufacturerName,
                                            ModelNumber = n.ModelNumber,
                                            WarrentyDate = n.WarrentyDate,
                                            SerialNumber = n.SerialNumber,
                                            AssetValue = n.AssetValue,
                                            AssetTagNumber = n.AssetTagNumber,
                                            PurchaseOrderNumber = poh.PurchaseOrderNumber,
                                            PogeneratedOn = poh.PogeneratedOn,
                                            InvoiceNumber = inv.InvoiceNumber,
                                            InvoiceDate = inv.InvoiceDate,
                                            PolicyFilePath = i.PolicyFilePath,
                                         }).OrderBy(c => c.PurchaseOrderNumber).ToListAsync();
            
                var insuredItems = _mapper.Map<List<AssetInsuranceDto>>(insuredAssets);
            
            return insuredItems;
        }

        public async Task<bool> UpdateInsuranceDetails(InsurancePolicyDto insurancePolicy)
        {
            Guid referenceNumber = insurancePolicy.ReferenceNumber;
            List<InsuranceItem> insuranceRecord = await _dbContext.InsuranceItems
                            .Where(ins => ins.ReferenceNumber == referenceNumber).ToListAsync();
            foreach (var insurance in insuranceRecord)
            {
                insurance.PolicyFilePath = insurancePolicy.PolicyFilePath;
                insurance.UpdatedDate = DateTime.Now.ToUniversalTime();
                insurance.UpdatedBy = LoggedInUser;
            }

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteInsurancePolicy(Guid referenceNumber)
        {
            List<InsuranceItem> insuranceRecord = await _dbContext.InsuranceItems
                            .Where(ins => ins.ReferenceNumber == referenceNumber).ToListAsync();
            if (insuranceRecord == null)
            {
                throw new NullReferenceException($"Couldn't find record for {referenceNumber}");
            }
            
            foreach(var insurance in insuranceRecord)
            {
                insurance.PolicyFilePath = null;
                insurance.UpdatedDate = DateTime.Now.ToUniversalTime();
                insurance.UpdatedBy = LoggedInUser;
            }

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<string> GetBlobFilePath(Guid referenceNumber)
        {
            var insuranceDetails = await _dbContext.InsuranceItems
                            .FirstOrDefaultAsync(ins => ins.ReferenceNumber.Equals(referenceNumber));
            if (insuranceDetails == null)
            {
                throw new ArgumentNullException($"referenceNumber:{referenceNumber} not valid:", nameof(referenceNumber));
            }
            return insuranceDetails.PolicyFilePath;
        }
    }
}
