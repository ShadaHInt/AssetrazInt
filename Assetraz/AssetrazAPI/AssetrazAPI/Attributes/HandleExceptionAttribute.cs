using AssetrazContracts.Constants;
using AssetrazContracts.Enums;
using AssetrazContracts.Exceptions;
using AssetrazContracts.LoggerContracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net;

namespace AssetrazAPI.Attributes
{
    public class HandleExceptionAttribute: ExceptionFilterAttribute
    {
        private readonly ILogAnalytics _logger;

        public HandleExceptionAttribute(ILogAnalytics logger)
        {
            _logger = logger;
        }

        public override void OnException(ExceptionContext context)
        {
            if(context == null)
            {
                throw new ArgumentNullException(nameof(context), "Cannot be null");
            }

            var output = string.Empty;

            if(context.Exception.GetType().BaseType == typeof(BaseException))
            {
                var exception = (BaseException)context.Exception;
                output = GetBaseExceptionSummary(exception);
            } else
            {
                output = GetGenericExceptionSummary();
            }

            _logger.Error(context.Exception.ToString());

            // Have to further classify error code in future
            var result = new ObjectResult(new
            {
                output,
            })
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
            };

            context.Result = result;
        }

        private static string GetBaseExceptionSummary(BaseException baseException)
        {
            return baseException.ErrorCode.ToString();
        }

        private static string GetGenericExceptionSummary()
        {
            return ErrorCodeConstants.GenericError.ToString();
        }
    }
}
