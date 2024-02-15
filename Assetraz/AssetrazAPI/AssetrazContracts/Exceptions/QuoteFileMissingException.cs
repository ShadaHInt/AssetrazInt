using AssetrazContracts.Constants;

namespace AssetrazContracts.Exceptions
{
    public class QuoteFileMissingException : BaseException
    {
        public int _errorCode = ErrorCodeConstants.QuoteFileMissing;

        public override int ErrorCode { get => _errorCode; set => _errorCode = value; }

        public QuoteFileMissingException()
        {
        }

        public QuoteFileMissingException(string message) : base(message)
        {
        }

        public QuoteFileMissingException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
