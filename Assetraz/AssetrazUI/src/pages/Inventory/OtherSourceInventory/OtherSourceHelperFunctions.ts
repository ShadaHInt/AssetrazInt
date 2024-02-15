import { ICategory } from "../../../types/Category";

export const CategoryFieldRequired = (
  categoryId: string | undefined,
  categories: ICategory[],
  column: string
) => {
  let isColumnRequired: any;
  const categoryInfo: ICategory = categories.filter(
      (category) => category.categoryId === categoryId
  )[0];
  switch (column) {
      case "AssetTagNumber":
          isColumnRequired = categoryInfo?.assetTagRequired;
          break;

      case "SerialNumber":
          isColumnRequired = categoryInfo?.serialNumberRequired;
          break;
      case "Warranty":
          isColumnRequired = categoryInfo?.warrantyRequired;
          break;
      case "Issuable":
          isColumnRequired = categoryInfo?.issuable;
          break;
      default:
          isColumnRequired = true;
          break;
  }
  return isColumnRequired &&
      isColumnRequired.toString().toLowerCase() === "true"
      ? true
      : false;
};