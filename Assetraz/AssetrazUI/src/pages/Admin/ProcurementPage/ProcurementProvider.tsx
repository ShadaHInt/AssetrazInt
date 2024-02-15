import { useCallback, useEffect, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { IDropdownOption } from "@fluentui/react";

import { IProcurements } from "../../../types/Procurement";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { ProcurementList } from "../../../services/procurementService";
import { ProcurementStatus } from "../../../constants/ProcurementStatus";

import {
    IProcurementContext,
    ProcurementContextProvider,
} from "../../../Contexts/ProcurementProviderContext";

import ProcurementPage from "./ProcurementPage";
import { INITIAL_NETWORK_COMPANY, options } from "./ProcurementConstants";

const ProcurementProvider = ({
    requestNumber,
    userRequestNumber,
}: {
    requestNumber: string | undefined;
    userRequestNumber: string | undefined;
}) => {
    const [procurementData, setData] = useState<IProcurements[]>();
    const [filterdData, setFilteredData] = useState<IProcurements[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<string>();
    const [navigatingData, setNavigatingData] = useState<string | undefined>(
        undefined
    );
    const [userRequestNumberParam, setUserRequestNumber] = useState<
        string | undefined
    >(undefined);
    const [hasUserRequest, setHasUserRequest] = useState<boolean | undefined>(
        false
    );
    const [isPageLoading, { setTrue: setLoading, setFalse: stopLoading }] =
        useBoolean(false);

    const [networkCompanies, setNetworkCompanies] = useState<
        IDropdownOption<NetworkCompany>[] | any
    >([]);

    const [initialOption, setInitialOption] = useState<
        IDropdownOption<any> | undefined
    >();

    const [selectedItem, setSelectedItem] = useState<string | undefined>(
        options.Draft
    );

    const isVendorMatching = (
        vendor: string[] | undefined,
        searchKeyword: string
    ): boolean => {
        if (!vendor) {
            return false; // Consider items without vendorList as not matching
        }

        const filteredArray = vendor.filter((el) =>
            el.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        return filteredArray.length > 0;
    };

    useEffect(() => {
        if (requestNumber && hasUserRequest === false) {
            const data = procurementData?.find(
                (i) =>
                    i.requestNumber.toLowerCase() ===
                    requestNumber.toLowerCase()
            )?.procurementRequestId;
            setNavigatingData(data);
            setUserRequestNumber(userRequestNumber);
        }
    }, [hasUserRequest, procurementData, requestNumber]);

    useEffect(() => {
        if (navigatingData) {
            setHasUserRequest(true);
        }
    }, [hasUserRequest, navigatingData]);

    const getNetworkDetails = useCallback(async () => {
        try {
            await GetAllNetworkCompanies().then((res) => {
                res.unshift(INITIAL_NETWORK_COMPANY);
                setNetworkCompanies(res);
            });
        } catch (err) {
            setNetworkCompanies(null);
        }
    }, []);

    const getData = useCallback(async () => {
        setLoading();
        await ProcurementList()
            .then((res) => setData(res))
            .catch((err) => setData(undefined));
        stopLoading();
    }, [setLoading, stopLoading]);

    useEffect(() => {
        getData();
        getNetworkDetails();
    }, [getData, getNetworkDetails]);

    useEffect(() => {
        const initialOption = networkCompanies.find(
            (element: NetworkCompany) => element.isPrimary === true
        );
        setInitialOption(
            initialOption ??
                networkCompanies.find((element: any) =>
                    element.text
                        .toLowerCase()
                        .includes(INITIAL_NETWORK_COMPANY.key.toLowerCase())
                )
        );
        setSelectedCompany(
            initialOption ? initialOption.text : INITIAL_NETWORK_COMPANY.key
        );
    }, [networkCompanies]);

    useEffect(() => {
        let filteredData = procurementData
            ? procurementData.filter((i) =>
                  filterQuery
                      ? isVendorMatching(i.vendorNameList, filterQuery) ||
                        i.requestNumber
                            .toLowerCase()
                            .indexOf(filterQuery.toLowerCase()) > -1
                      : i.vendorNameList !== undefined
              )
            : [];

        filteredData =
            selectedItem !== options.All
                ? selectedItem === undefined || selectedItem === options.Draft
                    ? filteredData.filter(
                          (i) => i.status === ProcurementStatus.Submitted
                      )
                    : selectedItem === options["Pending Approval"]
                    ? filteredData.filter(
                          (i) =>
                              i.status === ProcurementStatus["Pending Approval"]
                      )
                    : selectedItem === options.Approved ||
                      selectedItem === options.Rejected ||
                      selectedItem === options.Withdrawn
                    ? filteredData.filter((i) => i.status === selectedItem)
                    : filteredData.filter(
                          (i) => i.status === ProcurementStatus.Generated
                      )
                : filteredData;

        filteredData =
            selectedCompany !== INITIAL_NETWORK_COMPANY.key
                ? filteredData.filter(
                      (i) => i.networkCompany === selectedCompany
                  )
                : filteredData;

        setFilteredData(filteredData);
    }, [procurementData, selectedItem, selectedCompany, filterQuery]);

    const contextValue: IProcurementContext = {
        procurementData,
        setData,
        networkCompanies,
        initialOption,
        setInitialOption,
        selectedCompany,
        setSelectedCompany,
        selectedItem,
        setSelectedItem,
        filterQuery,
        setFilterQuery,
        filterdData,
        setFilteredData,
    };

    return (
        <ProcurementContextProvider value={contextValue}>
            <ProcurementPage
                isPageLoading={isPageLoading}
                getData={getData}
                navigatingData={navigatingData}
                onModalClose={() => {
                    setNavigatingData(undefined);
                    setUserRequestNumber(undefined);
                }}
                userRequestNumber={userRequestNumberParam}
            />
        </ProcurementContextProvider>
    );
};

export default ProcurementProvider;
