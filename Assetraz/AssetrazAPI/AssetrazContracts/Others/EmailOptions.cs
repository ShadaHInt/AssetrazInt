namespace AssetrazContracts.Others
{
    public class EmailAddress
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class EmailOptions
    {
        public string SMTPServer { get; set; }
        public string Username { get; set; }
        public int Port { get; set; }
        public string Password { get; set; }
        public bool IsServiceOn { get; set; }
        public EmailAddress From { get; set; } = new EmailAddress();
        public EmailAddress? Accounts { get; set; } = new EmailAddress();

    }
}
