using AssetrazContracts.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.Exceptions
{
    public class PrimaryCompanyException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.PrimaryExist;
        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public PrimaryCompanyException()
        {
        }

        public PrimaryCompanyException(string message) : base(message)
        {
        }

        public PrimaryCompanyException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
