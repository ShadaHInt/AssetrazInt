using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class DetailsMissingException : BaseException
    {
        private int _errorCode = ErrorCodeConstants.DetailsMissing;

        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }
        
        public DetailsMissingException()
        {
        }

        public DetailsMissingException(string message): base(message)
        {
        }

        public DetailsMissingException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
