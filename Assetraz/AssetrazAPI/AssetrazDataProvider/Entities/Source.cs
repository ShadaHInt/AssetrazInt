using System;
using System.Collections.Generic;

namespace AssetrazDataProvider.Entities
{
    public partial class Source
    {
        public Source()
        {
            InventoriesOtherSourcesHeaders = new HashSet<InventoriesOtherSourcesHeader>();
        }

        public Guid SourceId { get; set; }
        public string SourceName { get; set; } = null!;
        public bool Active { get; set; }
        public string CreatedBy { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; } = null!;
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<InventoriesOtherSourcesHeader> InventoriesOtherSourcesHeaders { get; set; }
    }
}
