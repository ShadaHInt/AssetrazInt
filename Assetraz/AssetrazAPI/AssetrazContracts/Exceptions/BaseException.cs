namespace AssetrazContracts.Exceptions
{
    [Serializable]
    public abstract class BaseException: Exception
    {
        public abstract int ErrorCode { get; set; }

        protected BaseException()
        { 
        }

        protected BaseException(string message): base(message)
        {
        }

        protected BaseException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
