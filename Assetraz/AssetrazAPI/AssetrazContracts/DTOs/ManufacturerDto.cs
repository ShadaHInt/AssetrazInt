using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AssetrazContracts.DTOs
{
    public class ManufacturerDto
    {
        public Guid ManfacturerId { get; set; }
        public string ManufacturerName { get; set; } = null!;
        public bool PreferredManufacturer { get; set; }
        public bool Active { get; set; }
    }
}
