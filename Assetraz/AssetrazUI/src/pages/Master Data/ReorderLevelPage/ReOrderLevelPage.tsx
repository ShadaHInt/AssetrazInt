import { FormEvent, useCallback, useEffect, useState } from "react";
import {
    IDropdownOption,
    PrimaryButton,
    Separator,
    Spinner,
    SpinnerSize,
    Stack,
    StackItem,
    Text,
} from "@fluentui/react";

import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import {
    AddReorderLevel,
    GetReorderLevelList,
    UpdateReorderLevel,
} from "../../../services/reOrderLevelServices";

import PageTemplate from "../../../components/common/PageTemplate";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import ReOrderLevelDetailsList from "./ReOrderLevelDetailsList";

import { dropdownStyles, stackItemStyles } from "./ReorderLevelStyles";

import { NetworkCompany } from "../../../types/NetworkCompany";
import { reOrderLevel } from "../../../types/ReOrderLevel";
import { numericRegex } from "./ReOrderLevelConstants";
import { deepEqual } from "../../Admin/AssignedRoles/AssignedRolesModalHelperFunctions";

const ReOrderlevelPage = () => {
    const [NetworkCompanies, setNetworkCompanies] = useState<
        IDropdownOption<NetworkCompany>[]
    >([]);
    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<IDropdownOption<NetworkCompany>>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [successMessage, setSuccessMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reOrderLists, setReOrderLists] = useState<reOrderLevel[]>([]);
    const [editedROList, setEditedROList] =
        useState<reOrderLevel[]>(reOrderLists);
    const [isError, setIsError] = useState<boolean>(false);

    const networkCompanyHandler = async (
        e: FormEvent<HTMLDivElement>,
        networkCompany: IDropdownOption<NetworkCompany> | undefined
    ) => {
        setSelectedNetworkCompany(networkCompany);
        setIsError(false);
    };

    const saveHandler = useCallback(async () => {
        setIsError(true);
        let isValid: boolean = true;
        editedROList.some((item: reOrderLevel) => {
            if (
                !numericRegex.test(item.reOrderLevel.toString()) ||
                !numericRegex.test(item.warningLevel.toString()) ||
                !numericRegex.test(item.criticalLevel.toString())
            ) {
                setErrorMessage("Positive integer value is required");
                isValid = false;
                return true;
            } else if (
                Number(item.warningLevel) === 0 &&
                Number(item.criticalLevel) === 0
            ) {
                setErrorMessage("");
            } else if (
                Number(item.reOrderLevel) <= Number(item.warningLevel) ||
                Number(item.warningLevel) >= Number(item.reOrderLevel) ||
                Number(item.criticalLevel) >= Number(item.warningLevel)
            ) {
                setErrorMessage(
                    "Levels should be in the order : Re-order level > Warning level > Critical level"
                );
                isValid = false;
                return true;
            } else if (
                item.reOrderLevel.toString().trim() === "" ||
                item.warningLevel.toString().trim() === "" ||
                item.criticalLevel.toString().trim() === ""
            ) {
                setErrorMessage("");
            }
            return false;
        });

        if (isValid) {
            setIsLoading(true);
            const updatedROList = editedROList.map((item) => ({
                ...item,
                reOrderLevel: Number(item.reOrderLevel),
                criticalLevel: Number(item.criticalLevel),
                warningLevel: Number(item.warningLevel),
            }));

            const elementsToAdd: reOrderLevel[] = updatedROList.filter(
                (i) => i.reOrderId === null
            );
            const elementsToUpdate: reOrderLevel[] = updatedROList.filter(
                (i) => i.reOrderId !== null
            );

            let updateResponse: boolean = false;
            try {
                if (elementsToAdd?.length > 0) {
                    const addResponse = await AddReorderLevel(elementsToAdd);
                    if (addResponse && elementsToUpdate?.length > 0) {
                        updateResponse = await UpdateReorderLevel(
                            elementsToUpdate
                        );
                    } else {
                        updateResponse = addResponse;
                    }
                } else {
                    updateResponse = await UpdateReorderLevel(elementsToUpdate);
                }

                if (updateResponse) {
                    selectedNetworkCompany &&
                        getReOrderLevelDetails(
                            selectedNetworkCompany.key.toString()
                        );
                    setSuccessMessage("Successfully saved");
                    setIsError(false);
                }
            } catch (err: any) {
                setErrorMessage(err);
            } finally {
                setIsLoading(false);
            }
        }
    }, [editedROList, selectedNetworkCompany]);

    const getReOrderLevelDetails = async (networkCompanyId: string) => {
        setIsLoading(true);
        const response = await GetReorderLevelList(networkCompanyId);
        setIsLoading(false);
        setReOrderLists(response);
        setEditedROList(response);
    };

    const isSaveDisabled = (): boolean => {
        const updatedROList = editedROList.map((item) => ({
            ...item,
            reOrderLevel: Number(item.reOrderLevel),
            criticalLevel: Number(item.criticalLevel),
            warningLevel: Number(item.warningLevel),
        }));
        return deepEqual(updatedROList, reOrderLists);
    };

    useEffect(() => {
        const getNetworkCompanies = async () => {
            try {
                const networkCompanies = await GetAllNetworkCompanies();
                setNetworkCompanies(networkCompanies);
            } catch (err: any) {
                setErrorMessage(err);
            }
        };
        getNetworkCompanies();
    }, []);

    useEffect(() => {
        if (selectedNetworkCompany) {
            getReOrderLevelDetails(selectedNetworkCompany.key.toString());
        }
    }, [selectedNetworkCompany]);

    return (
        <>
            <PageTemplate
                errorMessage={errorMessage}
                clearErrorMessage={() => {
                    setIsError(false);
                    setErrorMessage("");
                }}
                successMessageBar={successMessage}
                setSuccessMessageBar={setSuccessMessage}
            >
                <Stack
                    horizontal
                    styles={stackItemStyles}
                    horizontalAlign="space-between"
                >
                    <StackItem>
                        <SearchableDropdown
                            placeholder="Select network company"
                            label="Network Company"
                            options={NetworkCompanies ? NetworkCompanies : []}
                            onChange={networkCompanyHandler}
                            styles={dropdownStyles}
                            selectedKey={selectedNetworkCompany?.key}
                        />
                    </StackItem>
                    <StackItem align="end">
                        <PrimaryButton
                            text="Save"
                            onClick={saveHandler}
                            disabled={isSaveDisabled()}
                        />
                    </StackItem>
                </Stack>
                <Separator />
                {isLoading ? (
                    <Spinner
                        size={SpinnerSize.large}
                        label="Loading... Please wait!"
                    />
                ) : reOrderLists.length > 0 ? (
                    <ReOrderLevelDetailsList
                        editedROList={editedROList ?? []}
                        setEditedROList={setEditedROList}
                        isError={isError}
                    />
                ) : (
                    <Text variant="small">Please select a network company</Text>
                )}
            </PageTemplate>
        </>
    );
};

export default ReOrderlevelPage;
