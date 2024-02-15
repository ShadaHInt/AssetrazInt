//using LINQtoCSV;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using System.Xml.Linq;

//namespace AssetrazContracts.DTOs
//{
//    public class InventoryDto
//    {
//        [CsvColumn(Name = "Category", FieldIndex = 1)]
//        public string? CategoryName { get; set; }
//        [CsvColumn(Name = "Manufacturer", FieldIndex = 2)]
//        public string? ManufacturerName { get; set; }
//        [CsvColumn(Name = "Model Number", FieldIndex = 3)]
//        public string? ModelNumber { get; set; }
//        [CsvColumn( FieldIndex = 4)]
//        public string Specifications { get; set; } = null!;
//        [CsvColumn(Name = "Warrenty Date", CanBeNull = true, FieldIndex = 5)]
//        public DateTime? WarrentyDate { get; set; }
//        [CsvColumn(Name = "Serial Number", FieldIndex = 6)]
//        public string? SerialNumber { get; set; }
//        [CsvColumn(Name = "Asset Tag #", FieldIndex = 7)]
//        public string? AssetTagNumber { get; set; }
//        [CsvColumn(Name = "Asset Value", FieldIndex = 8)]
//        public decimal AssetValue { get; set; }

//    }
//}
