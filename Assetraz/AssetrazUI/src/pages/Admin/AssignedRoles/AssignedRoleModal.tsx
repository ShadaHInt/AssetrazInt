import React, { useEffect, useState, useCallback, useReducer } from "react";
import {
    Checkbox,
    DefaultButton,
    Dropdown,
    IDropdownOption,
    IconButton,
    Label,
    PrimaryButton,
    Stack,
    TextField,
} from "@fluentui/react";

import { useBoolean } from "@fluentui/react-hooks";

import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";

import { getEmployees } from "../../../services/user/userServices";
import { User } from "../../../types/User";

import {
    dropdownStyles,
    inlineInputStyle,
    input50,
    stackItemStyles,
} from "../EmployeeAssets/EmployeeAssetsStyles";

import { useAsync } from "../../../services/hooks/UseAsync";
import {
    AddUserRoles,
    DeleteUserRoles,
    EditUserRoles,
    GetUserRoles,
} from "../../../services/AssignedRolesServices";

import { buttonStyles } from "../UserRequestsPage/UserRequestPage.styles";
import {
    AssignRoleRequest,
    IAssignedRoleModal,
    Role,
    UserRole,
} from "./AssignedRolesTypes";

import {
    ConvertToAssignRoleRequest,
    deepEqual,
    reducer,
} from "./AssignedRolesModalHelperFunctions";
import { useMsal } from "@azure/msal-react";
import {
    IGPContext,
    useGeneralPageContext,
} from "../../../Contexts/GeneralPageContext";
import SytledDialog from "../../../components/common/StyledDialog";
import { deleteIcon, deleteIconStyles } from "./AssignRolesStyles";

export const AssignedRoleModal: React.FC<IAssignedRoleModal> = ({
    isModalOpen,
    setIsModalOpen,
    setSuccessMessage,
    execute,
    selectedUserDetails,
}) => {
    const { accounts } = useMsal();
    const logedInUserMail = accounts[0]?.username;
    const { fetchAssignedRoles } = useGeneralPageContext() as IGPContext;
    const { status: rolesDataStatus, data: rolesData } = useAsync(
        GetUserRoles,
        true
    );

    const [initialDetails, setInitialDetails] = useState<any>();
    const [employeesListOptions, setEmployeesListOptions] =
        useState<any>(undefined);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [addRequestLoading, setAddRequestLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);

    const initialState: AssignRoleRequest = {};
    const [assignRoleRequest, dispatch] = useReducer(reducer, initialState);
    const dropdownOptions = rolesData
        ?.filter((role) => selectedRoleIds.includes(role.roleId))
        .map((role) => ({ key: role.roleId.toString(), text: role.roleName }));
    const handleCheckboxChange = useCallback(
        (role: Role) => {
            const updatedRoleIds = selectedRoleIds.includes(role.roleId)
                ? selectedRoleIds.filter((id) => id !== role.roleId)
                : [...selectedRoleIds, role.roleId];
            setSelectedRoleIds(updatedRoleIds);
            dispatch({ type: "SET_ROLE_IDS", payload: updatedRoleIds });
        },
        [selectedRoleIds]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEmployees();
                transformEmployeesForListing(res);
            } catch (err) {
                setEmployeesListOptions(null);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedUserDetails) {
            var convertedDetails = ConvertToAssignRoleRequest(
                selectedUserDetails as unknown as {
                    userName: string;
                    userEmailId: string;
                    userRoles: UserRole[];
                }
            );

            if (convertedDetails) {
                setInitialDetails(convertedDetails);
                convertedDetails.userRoleIds &&
                    setSelectedRoleIds(convertedDetails.userRoleIds);
                dispatch({
                    type: "SET_ALL_DETAILS",
                    payload: convertedDetails,
                });
            }
        }
    }, [selectedUserDetails]);

    const transformEmployeesForListing = useCallback(
        (employeesList: User[]): void => {
            const empList: IDropdownOption[] = employeesList.map((r: User) => ({
                key: r.mail,
                text: r.displayName + " (" + r.jobTitle + ")",
            }));
            setEmployeesListOptions(empList);
        },
        []
    );

    const changeHandler = useCallback((e: any, option: any) => {
        dispatch({ type: "SET_USER_NAME", payload: option.text });
        dispatch({ type: "SET_USER_EMAIL", payload: option.key });
    }, []);

    const handleDropdownChange = useCallback(
        (
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption<any> | undefined
        ): void => {
            if (item?.key) {
                dispatch({
                    type: "SET_DEFAULT_ROLE_ID",
                    payload: Number(item?.key),
                });
            }
        },
        []
    );

    const reFetchRoles = useCallback(() => {
        const selectedUserEmail = (
            selectedUserDetails as unknown as { userEmailId: string }
        )?.userEmailId;

        if (logedInUserMail === selectedUserEmail) {
            fetchAssignedRoles(true);
        }
    }, [fetchAssignedRoles, logedInUserMail, selectedUserDetails]);

    const submitData = useCallback(async () => {
        try {
            if (selectedUserDetails) {
                setAddRequestLoading(true);
                const assignUserPrevelege = await EditUserRoles(
                    assignRoleRequest
                );
                if (assignUserPrevelege) {
                    setIsModalOpen(false);
                    setErrorMessage("");
                    setSuccessMessage("Successfully updated user roles");
                    execute();
                    dispatch({ type: "RESET_STATE" });
                    setSelectedRoleIds([]);
                }
            } else {
                setAddRequestLoading(true);
                const assignUserPrevelege = await AddUserRoles(
                    assignRoleRequest
                );
                if (assignUserPrevelege) {
                    setIsModalOpen(false);
                    setErrorMessage("");
                    setSuccessMessage("Successfully added roles for user");
                    execute();
                    dispatch({ type: "RESET_STATE" });
                    setSelectedRoleIds([]);
                    return;
                } else if (!assignUserPrevelege) {
                    setErrorMessage("Privileges for this user already exists");
                }
            }
            reFetchRoles();
        } catch (err) {
            setErrorMessage(err as string);
        } finally {
            setAddRequestLoading(false);
        }
    }, [
        assignRoleRequest,
        execute,
        reFetchRoles,
        selectedUserDetails,
        setIsModalOpen,
        setSuccessMessage,
    ]);

    const submitButtonDisabled = useCallback(() => {
        const areRequiredFieldsEmpty =
            !assignRoleRequest?.defaultRoleId ||
            !assignRoleRequest?.userEmailId ||
            !assignRoleRequest?.userName ||
            !assignRoleRequest?.userRoleIds;

        if (selectedUserDetails) {
            return (
                deepEqual(assignRoleRequest, initialDetails) ||
                areRequiredFieldsEmpty
            );
        } else {
            return areRequiredFieldsEmpty;
        }
    }, [assignRoleRequest, initialDetails, selectedUserDetails]);

    const deleteUserPrivileges = useCallback(async () => {
        setAddRequestLoading(true);
        toggleDeleteDialog();
        try {
            const deleteUserRoles = await DeleteUserRoles(
                assignRoleRequest.userEmailId as string
            );

            if (deleteUserRoles) {
                setIsModalOpen(false);
                setErrorMessage("");
                setSuccessMessage(
                    `Successfully deleted roles for the user ${assignRoleRequest.userName}`
                );
                execute();
                dispatch({ type: "RESET_STATE" });
                setSelectedRoleIds([]);
            }
        } catch (error) {
            setErrorMessage(error as string);
        } finally {
            setAddRequestLoading(false);
        }
        return;
    }, [
        assignRoleRequest.userEmailId,
        assignRoleRequest.userName,
        execute,
        setIsModalOpen,
        setSuccessMessage,
        toggleDeleteDialog,
    ]);

    const DeleteDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showDeleteDialog}
                toggleDialog={toggleDeleteDialog}
                title="Delete User Privileges"
                subText={"Are you sure you want to delete all user privileges?"}
                action={deleteUserPrivileges}
            />
        );
    }, [deleteUserPrivileges, showDeleteDialog, toggleDeleteDialog]);

    const AssignRoleModalFooter = () => {
        return (
            <Stack horizontal horizontalAlign="space-between">
                <Stack horizontalAlign="start">
                    {selectedUserDetails &&
                        logedInUserMail !== assignRoleRequest.userEmailId && (
                            <IconButton
                                styles={deleteIconStyles}
                                iconProps={deleteIcon}
                                ariaLabel="Delete"
                                onClick={toggleDeleteDialog}
                                title="Delete privileges"
                            />
                        )}
                </Stack>
                <Stack horizontal horizontalAlign="end">
                    <DefaultButton
                        styles={buttonStyles}
                        onClick={() => {
                            setIsModalOpen(false);
                            setErrorMessage("");
                            dispatch({ type: "RESET_STATE" });
                            setSelectedRoleIds([]);
                        }}
                        text="Cancel"
                    />
                    <PrimaryButton
                        styles={buttonStyles}
                        onClick={() => submitData()}
                        text="Submit"
                        disabled={submitButtonDisabled()}
                    />
                </Stack>
            </Stack>
        );
    };

    return (
        <StyledModal
            isOpen={isModalOpen}
            title={
                !selectedUserDetails ? "Assign roles" : "Edit Assigned Roles"
            }
            onDismiss={() => {
                setIsModalOpen(false);
                setErrorMessage("");
                dispatch({ type: "RESET_STATE" });
                setSelectedRoleIds([]);
            }}
            size={ModalSize.Medium}
            isLoading={addRequestLoading || rolesDataStatus === "pending"}
            setErrorMessageBar={setErrorMessage}
            errorMessageBar={errorMessage}
        >
            <DeleteDialog />
            <Stack horizontal styles={stackItemStyles}>
                <SearchableDropdown
                    options={employeesListOptions}
                    onChange={changeHandler}
                    placeholder="Select an employee"
                    label={"Employee"}
                    styles={dropdownStyles}
                    required
                    selectedKey={assignRoleRequest.userEmailId}
                    disabled={selectedUserDetails !== undefined}
                />
                <Stack.Item styles={input50}>
                    <TextField
                        readOnly
                        styles={inlineInputStyle}
                        borderless
                        name="mail"
                        value={assignRoleRequest.userEmailId || ""}
                    />
                </Stack.Item>
            </Stack>

            <Stack
                horizontal
                horizontalAlign="space-between"
                styles={stackItemStyles}
            >
                <Stack.Item>
                    <Label required>Assign Roles</Label>
                    <Stack
                        style={{
                            maxHeight: "32vh",
                            overflow: "auto",
                        }}
                    >
                        {rolesData?.map((role: Role) => (
                            <Checkbox
                                styles={{ root: { margin: "5px 5px 5px 0px" } }}
                                key={role.roleId}
                                label={role.roleName}
                                onChange={() => handleCheckboxChange(role)}
                                checked={assignRoleRequest.userRoleIds?.includes(
                                    role.roleId
                                )}
                            />
                        ))}
                    </Stack>
                </Stack.Item>
                <Stack.Item>
                    <Label required> Default Role</Label>
                    <Dropdown
                        placeholder="Select one default role"
                        style={{ width: 300 }}
                        options={dropdownOptions ?? []}
                        onChange={handleDropdownChange}
                        selectedKey={
                            assignRoleRequest.defaultRoleId?.toString() ?? null
                        }
                    />
                </Stack.Item>
            </Stack>
            <StyleModalFooter>
                <AssignRoleModalFooter />
            </StyleModalFooter>
        </StyledModal>
    );
};
