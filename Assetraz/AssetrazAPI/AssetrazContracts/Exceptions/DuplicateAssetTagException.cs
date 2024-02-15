using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class DuplicateAssetTagException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.DuplicateAssetTag;
        public override int ErrorCode { get =>_errorCode; set => _errorCode = value; }

        public DuplicateAssetTagException()
        {
        }

        public DuplicateAssetTagException(string message) : base(message)
        {
        }

        public DuplicateAssetTagException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
