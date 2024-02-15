using AssetrazContracts.Constants;
using System;
using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class DuplicateSerialNumberException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.DuplicateSerialNumber;
        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public DuplicateSerialNumberException()
        {
        }

        public DuplicateSerialNumberException(string message) : base(message)
        {
        }

        public DuplicateSerialNumberException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}

