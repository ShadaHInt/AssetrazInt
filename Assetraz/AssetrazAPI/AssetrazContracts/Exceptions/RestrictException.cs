using AssetrazContracts.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.Exceptions
{
    public class RestrictException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.Restrict;
        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public RestrictException()
        {
        }

        public RestrictException(string message) : base(message)
        {
        }

        public RestrictException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
