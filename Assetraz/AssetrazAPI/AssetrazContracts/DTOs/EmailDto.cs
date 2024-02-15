namespace AssetrazContracts.DTOs
{
    public class EmailDto
    {
        // key = Name, value = Email
        public Dictionary<string, string> To { get; set; }
        public Dictionary<string, string>? From { get; set; }
        public Dictionary<string, string>? Cc { get; set; }
        // key = File name, value = stream content
        public Dictionary<string, MemoryStream>? Attachment { get; set; }
        public string Subject { get; set; }
        public List<string> Body { get; set; }
        public string? Footer { get; set; }
        public string? referenceid { get; set; }
    }
}
