using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class DuplicateException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.Duplicate;
        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public DuplicateException()
        {
        }

        public DuplicateException(string message) : base(message)
        {
        }

        public DuplicateException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
