import { IsStringValid } from "../../../Other/InputValidation";
import { ICategory } from "../../../types/Category";

const validateInput = (value: string, regex: RegExp, required: boolean) => {
    if (required && !IsStringValid(value)) {
        return "Required";
    }
    if (regex.test(value)) {
        return "Invalid Input";
    }
    return "";
};

const CategoryFieldRequired = (
    categoryName: string,
    categories: ICategory[],
    column: string
) => {
    let isColumnRequired: any;
    const categoryInfo: ICategory = categories.filter(
        (category) => category.categoryName === categoryName
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

export {CategoryFieldRequired, validateInput};