using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace AssetrazAccessors.Common
{
    public class AccessorCommon
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccessorCommon(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string LoggedInUser
        {
            get
            {
                ClaimsPrincipal user = _httpContextAccessor.HttpContext.User;
                return user.Identity.Name;
            }
        }

        public string LoggedInUserName
        {
            get
            {
                ClaimsPrincipal user = _httpContextAccessor.HttpContext.User;
                return user.Claims.First(c => c.Type == "name").Value;
            }
        }
    }
}
