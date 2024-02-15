using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class DuplicateVendorNameException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.DuplicateVendorName;
        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public DuplicateVendorNameException()
        {
        }

        public DuplicateVendorNameException(string message) : base(message)
        {
        }

        public DuplicateVendorNameException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
