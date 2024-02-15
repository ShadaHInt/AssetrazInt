export const UPDATE_ASSETS_FILTER_COLUMNS =  [
      "Category",
      "Manufacturer",
      "Model Number",
      "Serial Number",
      "Asset Tag Number",
  ];

export const specialCharacterRegex = /^[^a-zA-Z0-9]/;
export const assetTagRegex = /[^a-zA-Z0-9-]|^-+|^[^a-zA-Z0-9]/;