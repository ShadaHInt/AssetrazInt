export const VALIDATION_TYPE = {
    NUMBER: 1,
    DATE: 2,
    INT: 3,
};

type ValidationType = typeof VALIDATION_TYPE[keyof typeof VALIDATION_TYPE];

const getErrorMessage = (value: any, type?: ValidationType): string => {
    if (type === VALIDATION_TYPE.NUMBER) {
        return !IsNumericGreZero(value) ? "Numeric required" : "";
    } else if (type === VALIDATION_TYPE.DATE) {
        return !IsValidDate(value) ? "Date Required" : "";
    } else if (type === VALIDATION_TYPE.INT) {
        return !IsIntGreZero(value) ? "Number required" : "";
    }
    return !IsStringValid(value) ? "Required" : "";
};

export const IsValidDate = (input: any) => {
    return input && (input instanceof Date || new Date(input) instanceof Date);
};

export const IsStringValid = (input: any) => {
    return input && input.length > 0;
};

export const IsNumericGreZero = (input: any) => {
    return !isNaN(input) && parseFloat(input) > 0;
};

export const IsIntGreZero = (input: any) => {
    return !isNaN(input) && parseInt(input) > 0;
};

export const validateContactNumber = (value: string) => {
    var contactRegex = /^[6-9]\d{9}$/;
    if (value?.trim().length === 0) {
        return "Required";
    } else {
        if (contactRegex.test(value)) {
            return "";
        } else {
            return "Invalid contact number";
        }
    }
};

export default getErrorMessage;
