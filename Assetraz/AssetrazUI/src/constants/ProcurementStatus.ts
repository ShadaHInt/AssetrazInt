export const ProcurementStatus = {
    Submitted: "Submitted",
    Generated: "Generated",
    Approved: "Approved",
    Rejected: "Rejected",
    Withdrawn: "Withdrawn",
    "Pending Approval": "ApporvalRequire",
};

export const getProcurementStatus = (status: string): string => {
    if (status === ProcurementStatus.Submitted) return "Draft";
    else if (status === ProcurementStatus.Generated) return "Pending Quotes";
    else if (status === ProcurementStatus["Pending Approval"])
        return "Pending Approval";
    else return status;
};
