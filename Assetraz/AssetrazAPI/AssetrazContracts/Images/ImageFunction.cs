namespace AssetrazContracts.Images
{
    public static class ImageFunction
    {
        public static string ValoremLogoFilePath
        {
            get
            {
                string absLocation = System.Reflection.Assembly.GetExecutingAssembly().Location;
                string strWorkPath = Path.GetDirectoryName(absLocation);
                return Path.Combine(strWorkPath, @"..\", "Images", "Valorem.jpg");
            }
        }
    }
}
