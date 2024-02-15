const gbFormat = new Intl.DateTimeFormat("en-GB");
const ddMMMYYYFormat = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

export const convertDateToGBFormat = (value: any) => {
    return value && gbFormat.format(new Date(value));
};

export const convertDateToddMMMYYYFormat = (value: any) => {
    return value && ddMMMYYYFormat.format(new Date(value));
};
export const convertUTCDateToLocalDate = (dateToBeConverted: Date) =>
 {  
var localDate = new Date(new Date(dateToBeConverted).getTime() - new Date(dateToBeConverted).getTimezoneOffset() * 60 * 1000);   
return localDate;
};
export const convertLocalDateToUTCDate = (localDate: Date) => {  
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000);   
    return utcDate;
  };
  