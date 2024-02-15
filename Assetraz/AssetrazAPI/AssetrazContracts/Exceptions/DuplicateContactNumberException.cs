using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class DuplicateContactNumberException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.DuplicateContactNumber;
        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public DuplicateContactNumberException()
        {
        }

        public DuplicateContactNumberException(string message) : base(message)
        {
        }

        public DuplicateContactNumberException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
