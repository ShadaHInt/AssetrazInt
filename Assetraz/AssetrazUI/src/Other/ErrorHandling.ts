const ErrorCodesMessage = {
    GERNERIC: "1001",
    DUPLICATEASSETTAGNUMBER: "1002",
    QUOTEFILEMISSING: "1003",
    DETAILSMISSING: "1004",
    DUPLICATEENTITY: "1005",
    RESTRICT: "1006",
    PRIMARYEXIST: "1007",
    DUPLICATESERIALNUMBER:"1008",
    DUPLICATEVENDORNAME:"1009",
    DUPLICATECONTACTNUMBER:"1010",
};

export const getExceptionMessage = (error: any, entity?: string) => {
    let code: string = error.response.data?.output;
    if (!code || code.includes(ErrorCodesMessage.GERNERIC)) {
        return "Please contact administrator";
    } else if (code.includes(ErrorCodesMessage.DUPLICATEASSETTAGNUMBER)) {
        return "Duplicate asset tag number has been found in inventory assets !";
    } else if (code.includes(ErrorCodesMessage.QUOTEFILEMISSING)) {
        return "Quote file missing. Please upload quote file.";
    } else if (code.includes(ErrorCodesMessage.DETAILSMISSING)) {
        return "Please check the input details. Some of them are missing.";
    } else if (code.includes(ErrorCodesMessage.DUPLICATEENTITY)) {
        return `${entity} already exists `;
    } else if (code.includes(ErrorCodesMessage.RESTRICT)) {
        return `Assets with this ${entity} exists in the inventory register`;
    } else if (code.includes(ErrorCodesMessage.PRIMARYEXIST)) {
        return "Primary network company already exists";
    } else if (code.includes(ErrorCodesMessage.DUPLICATESERIALNUMBER)) {
        return "Duplicate Serial Number has been added! Please change it.";
    } else if (code.includes(ErrorCodesMessage.DUPLICATEVENDORNAME)) {
        return "Duplicate Vendor Name has been added! Please change it.";
    } else if (code.includes(ErrorCodesMessage.DUPLICATECONTACTNUMBER)) {
        return "Duplicate contact number has been added! Please change it.";
    }
};
