// External dependencies
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActionButton,
    DefaultButton,
    DirectionalHint,
    IColumn,
    IDropdownOption,
    Stack,
    TooltipHost,
} from "@fluentui/react";

// Components and services
import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import FilterComponents, {
    IFilterPropsDashboard,
} from "../../../components/common/FilterComponents";
import StyledSearchBar from "../../../components/common/StyledSearchBar";

// Types and constants
import { User } from "../../../types/User";
import { getEmployees } from "../../../services/user/userServices";
import { useAsync } from "../../../services/hooks/UseAsync";
import { UR_FILTER_COLUMNS } from "./UserReportConstants";

// Styles and CSS
import {
    calloutProps,
    hostStyles,
    infoButtonStyles,
} from "../../../components/common/TooltipStyles";
import { clearIcon, clearStackStyles } from "./UserReportStyles";
import { DownLoadFileComponent } from "../../../components/common/DownloadFileComponent";

export const UserReportDashboard: React.FC = () => {
    const {
        status: rolesDataStatus,
        data: userReportData,
        error: isError,
    } = useAsync(getEmployees, true);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const [filterQuery, setFilterQuery] = useState<string>("");
    const [filteredData, setFilteredData] = useState<User[] | undefined>([]);
    const [departmentOption, setDepartmentOption] = useState<
        IDropdownOption<any> | undefined
    >(undefined);
    const [designationOption, setDesignationOption] = useState<
        IDropdownOption<any> | undefined
    >(undefined);
    const [departments, setDepartments] = useState<
        IDropdownOption<any>[] | null
    >();

    const [designations, setDesignations] = useState<
        IDropdownOption<any>[] | null
    >();

    const tooltipContent = useMemo(
        () => (
            <div>
                <strong>Search for a keyword in the columns:</strong>
                <div>
                    {UR_FILTER_COLUMNS.map((value, index) => (
                        <span key={index}>
                            {value}
                            {index !== UR_FILTER_COLUMNS.length - 1 && ", "}
                        </span>
                    ))}
                </div>
            </div>
        ),
        []
    );

    useEffect(() => {
        const setDepartmentAndDesignationsData = async () => {
            try {
                if (userReportData) {
                    //separate departments for dropdown
                    const departmentNames: string[] = userReportData
                        .map((i: User) => i.department)
                        .filter((name: string) => name && name.trim());
                    const uniqueSortedDepartments = Array.from(
                        new Set(departmentNames)
                    ).sort();
                    const departmentOptions = uniqueSortedDepartments.map(
                        (name, index) => ({
                            key: (index + 1).toString(),
                            text: name,
                        })
                    );

                    //separate designations for dropdown
                    const designationNames: string[] = userReportData
                        .map((i: User) => i.jobTitle)
                        .filter((name: string) => name && name.trim());
                    const uniqueSortedDesignations = Array.from(
                        new Set(designationNames)
                    ).sort();
                    const designationOptions = uniqueSortedDesignations.map(
                        (name, index) => ({
                            key: (index + 1).toString(),
                            text: name,
                        })
                    );

                    setDesignations(designationOptions);
                    setDepartments(departmentOptions);
                }
            } catch (err) {
                setErrorMessage(err as string);
            }
        };

        setDepartmentAndDesignationsData();
    }, [userReportData]);

    useEffect(() => {
        let filteredData = userReportData?.filter(
            (d: User) =>
                d.displayName
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                d.mail?.toLowerCase().indexOf(filterQuery.toLowerCase()) > -1 ||
                d.companyName
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1 ||
                d.managerName
                    ?.toLowerCase()
                    .indexOf(filterQuery.toLowerCase()) > -1
        );

        //filter by department dropdown
        filteredData = departmentOption?.text
            ? filteredData?.filter(
                  (i: User) => i?.department === departmentOption?.text
              )
            : filteredData;

        //filter by designation dropdown
        filteredData = designationOption?.text
            ? filteredData?.filter(
                  (i: User) => i?.jobTitle === designationOption?.text
              )
            : filteredData;

        setFilteredData(filteredData);
    }, [
        userReportData,
        departmentOption?.text,
        designationOption?.text,
        filterQuery,
    ]);

    const onChangeDepartment = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setDepartmentOption(item);
        },
        []
    );

    const onChangeDesignation = useCallback(
        (event: any, item: IDropdownOption<any> | undefined): void => {
            item && setDesignationOption(item);
        },
        []
    );

    const filterProps: IFilterPropsDashboard[] = useMemo(
        () => [
            {
                type: "dropdown",
                label: "Department",
                placeholder: "Select department",
                options: departments ?? [],
                onChange: onChangeDepartment,
                defaultSelectedKey: undefined,
                selectedKey: departmentOption?.key,
            },
            {
                type: "dropdown",
                label: "Designation",
                placeholder: "Select desgination",
                options: designations ?? [],
                onChange: onChangeDesignation,
                defaultSelectedKey: undefined,
                selectedKey: designationOption?.key,
            },
        ],
        [
            departmentOption?.key,
            departments,
            designationOption?.key,
            designations,
            onChangeDepartment,
            onChangeDesignation,
        ]
    );

    const _columns: IColumn[] = useMemo(
        () => [
            {
                key: "displayName",
                name: "User Name",
                fieldName: "displayName",
                minWidth: 150,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "mail",
                name: "Email",
                fieldName: "mail",
                minWidth: 150,
                maxWidth: 175,
                isResizable: true,
            },
            {
                key: "companyName",
                name: "Company Name",
                fieldName: "companyName",
                minWidth: 150,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "managerName",
                name: "Manager",
                fieldName: "managerName",
                minWidth: 150,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "jobTitle",
                name: "Designation",
                fieldName: "jobTitle",
                minWidth: 150,
                maxWidth: 150,
                isResizable: true,
            },
            {
                key: "department",
                name: "Department",
                fieldName: "department",
                minWidth: 150,
                maxWidth: 150,
                isResizable: true,
            },
        ],
        []
    );

    return (
        <PageTemplate
            heading="User Report"
            isLoading={rolesDataStatus === "pending"}
            errorOccured={isError || errorMessage !== undefined}
            errorMessage={errorMessage}
            clearErrorMessage={() => setErrorMessage(undefined)}
        >
            {userReportData && userReportData.length > 0 ? (
                <>
                    <FilterComponents filterProps={filterProps}>
                        <Stack
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <StyledSearchBar onFilterChange={setFilterQuery} />
                            <TooltipHost
                                content={tooltipContent}
                                calloutProps={calloutProps}
                                styles={hostStyles}
                                directionalHint={DirectionalHint.rightCenter}
                            >
                                <DefaultButton
                                    aria-label={"more info"}
                                    styles={infoButtonStyles}
                                    iconProps={{ iconName: "Info" }}
                                />
                            </TooltipHost>
                        </Stack>
                    </FilterComponents>
                    <Stack
                        horizontal
                        horizontalAlign="end"
                        style={clearStackStyles}
                    >
                        <DownLoadFileComponent
                            data={filteredData ?? []}
                            columns={_columns}
                        />
                        <ActionButton
                            iconProps={clearIcon}
                            text="Clear filter"
                            onClick={() => {
                                setDesignationOption(undefined);
                                setDepartmentOption(undefined);
                                setFilterQuery("");
                            }}
                        />
                    </Stack>
                </>
            ) : null}

            <StyledDetailsList
                data={filteredData ?? []}
                columns={_columns}
                emptymessage="No requests found"
            />
        </PageTemplate>
    );
};
