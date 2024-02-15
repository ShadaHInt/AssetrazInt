export interface AssetReturnReasonFor {
  Resignation: "Resignation";
  Termination: "Termination";
  TempUsage: "Temporary Usage";
  Upgrading: "Upgrading";
  OutOfWarranty: "Available (Out Of Warranty)";
  PhysicalDamage: "Physical Damage";
  SoftwareIssue: "Software Issue";
  HardwareIssue: "Hardware Issue";
  Other: "Other";
}

export interface RefurbishementAssetStatusForKey {
  NotStarted: "NotStarted";
  InProgress: "InProgress";
  InWarranty: "InWarranty";
  Completed: "Completed";
  NotSuccessful: "NotSuccessful";
}

export const options = {
      "Not Started": "Not Started",
      "In Progress": "In Progress",
      "In Warranty" : "In Warranty",
      Completed: "Completed",
      "Not Successful": "Not Successful",
  };

export  const propertiesToCheck =  [
        "Category Name",
        "Manufacturer Name",
        "Model Number",
        "Serial Number",
        "Returned By",
        "Asset Tag Number",
    ];
