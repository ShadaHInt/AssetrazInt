using AssetrazContracts.DTOs;
using AssetrazContracts.ManagerContracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AssetrazAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private IAssetsManager assetsManager;
        private IUserManager userManager;
        public AssetsController(IAssetsManager AssetsManager, IUserManager UserManager)
        {
            assetsManager = AssetsManager;
            userManager = UserManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssets()
        {
            var assets = assetsManager.GetAssets();
            return Ok(assets);
        }

        [HttpGet("report")]
        public async Task<ActionResult<List<AssetDetailsDto>>> GetAssetsReport()
        {
            return Ok(await assetsManager.GetAssetsReport());
        }

        [HttpGet("activity-report")]
        public async Task<ActionResult<List<AssetTrackDto>>> GetAssetsActivityReport()
        {
            return Ok(await assetsManager.GetAssetsActivityReport());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssetDetails(Guid id)
        {
            var assetDetails = await assetsManager.GetAssetDetails(id);
            return Ok(assetDetails);
        }

        [HttpPost("issue")]
        public async Task<ActionResult<bool>> IssueAsset(AssetTrackDto assetTrackDto)
        {
            bool response = await assetsManager.IssueAsset(assetTrackDto);

            return Ok(response);
        }

        [HttpPost("return")]
        public async Task<ActionResult<bool>> ReturnAsset(AssetTrackDto assetTrackDto)
        {
            bool response = await assetsManager.ReturnAsset(assetTrackDto);

            return Ok(response);
        }

        [HttpGet("getAssetByuser/{userEmail?}")]
        public async Task<IActionResult> GetAssetsByUser(string? userEmail = null)
        {
            var assets = await assetsManager.GetAssetsByUser(userEmail);
            return Ok(assets);
        }

        [HttpGet("invoice/{invoiceId}")]
        public async Task<ActionResult<List<AssetDto>>> AssetsFromInvoice(Guid invoiceId)
        {
            return Ok(await assetsManager.GetAssetsFromInvoice(invoiceId));
        }

        [HttpPut("update-purchased")]
        public async Task<IActionResult> UpdateAssetDetails(List<AssetDto> assets, [Required] Guid invoiceId, bool register)
        {
            return Ok(await assetsManager.UpdateAssetDetails(assets, invoiceId, register));
        }

        [HttpGet("refurbished-assets")]
        public async Task<ActionResult<List<RefurbishedAssetDto>>> GetRefurbishedAssets()
        {
            return Ok(await assetsManager.GetRefurbishedAssets());
        }

        [HttpGet("refurbished-asset-byId")]
        public async Task<ActionResult<RefurbishedAssetDto>> GetRefurbishedAssetById(Guid refurbishAssetId)
        {
            return Ok(await assetsManager.GetRefurbishedAssetById(refurbishAssetId));
        }

        [HttpPut("update-refurbished")]
        public async Task<IActionResult> UpdateRefurbishedAsset(RefurbishedAssetDto refurbishedAsset, Guid refurbishAssetId)
        {
            return Ok(await assetsManager.UpdateRefurbishedAsset(refurbishedAsset, refurbishAssetId));
        }

        [HttpGet("scrap-list")]
        public async Task<ActionResult<List<ScrapListDto>>> GetScrapList()
        {
            return Ok(await assetsManager.GetScrapList());
        }

        [HttpGet("other-source")]
        public async Task<ActionResult<List<OtherSourcesInventoryDto>>> GetOtherSourcesInventory()
        {
            return Ok(await assetsManager.GetOtherSourcesInventory());
        }

        [HttpGet("other-source/{inventoryOtherSourceId}")]
        public async Task<ActionResult<List<OtherSourcesInventoryDto>>> GetOtherSourceInventoryById(Guid inventoryOtherSourceId)

        {
            return Ok(await assetsManager.GetOtherSourceInventoryById(inventoryOtherSourceId));
        }

        [HttpPost("add-other-source")]
        public async Task<ActionResult<Guid>> AddOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto, bool register)
        {
            Guid response = await assetsManager.AddOtherSourceInventory(otherSourcesInventoryDto, register);

            return Ok(response);
        }

        [HttpPut("update-other-source")]
        public async Task<ActionResult<Guid>> UpdateOtherSourceInventory(List<OtherSourcesInventoryDto> otherSourcesInventoryDto, bool register, Guid inventoryOtherSourceId)
        {
            Guid response = await assetsManager.UpdateOtherSourceInventory(otherSourcesInventoryDto, register, inventoryOtherSourceId);

            return Ok(response);
        }

        [HttpPost("upload-support-document")]
        public async Task<ActionResult<bool>> UploadSupportDocument([FromForm] InventoryFileDto inventoryFileDto)
        {
            return Ok(await assetsManager.UploadSupportDocument(inventoryFileDto));
        }

        [HttpGet("download-support-document/{inventoryOtherSourceId}")]
        public async Task<IActionResult> DownloadSupportDocument(Guid inventoryOtherSourceId)
        {
            var response = await assetsManager.DownloadSupportDocument(inventoryOtherSourceId);

            if (response.Item1 == null)
                return NotFound();

            return File(response.Item1, response.Item2, response.Item3);
        }

        [HttpDelete("delete-support-document/{inventoryOtherSourceId}")]
        public async Task<IActionResult> DeleteSupportDocument(Guid inventoryOtherSourceId)
        {
            var response = await assetsManager.DeleteSupportDocument(inventoryOtherSourceId);

            return Ok(response);
        }

        [HttpGet("getIssuedAssetByUser")]
        public async Task<IActionResult> GetIssuedAssetsByUser()
        {
            var assets = await assetsManager.GetIssuedAssetsByUser();
            return Ok(assets);
        }

        [HttpGet("cutover-asset")]
        public async Task<IActionResult> GetCutOverAssets()
        {
            return Ok(await assetsManager.GetCutOverAssets());
        }

        [HttpDelete("delete-scrap/{refurbishedAssetId}")]
        public async Task<IActionResult> DeleteAssetFromScrapList(Guid refurbishedAssetId)
        {
            var response = await assetsManager.DeleteAssetfromScrapList(refurbishedAssetId);

            return Ok(response);
        }

        [HttpGet("issuable_aset/category/{categoryId}")]
        public async Task<ActionResult<List<AssetDetailsDto>>> GetIssuableAssetsCategory(Guid categoryId)
        {
            return Ok(await assetsManager.GetIssuableAssetsCategory(categoryId));
        }

        [HttpGet("notification")]
        public async Task<ActionResult<List<ReOrderLevelsDto>>> GetReorderLevelNotification()
        {
            return Ok(await assetsManager.GetReorderLevelNotification());
        }

        [HttpGet("all-assets")]
        public async Task<ActionResult<List<AllAssetDto>>> GetAllAssets()
        {
            return Ok(await assetsManager.GetAllAssets());
        }
        [HttpPut("update-asset")]
        public async Task<ActionResult<bool>> UpdateAsset(AllAssetDto asset)
        {
            return Ok(await assetsManager.UpdateAsset(asset));
        }

        [HttpGet("asset-register")]
        public async Task<IActionResult> GetAssetsList()
        {
            return Ok(await assetsManager.GetAssetsList());
        }

    }
}
