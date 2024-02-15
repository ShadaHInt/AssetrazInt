import { FC, useEffect, useState } from "react";
import DashboardModal from "./DashboardModal";
import { IColumn, Link, PrimaryButton, Stack } from "@fluentui/react";
import PageTemplate from "../../components/common/PageTemplate";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import IPurchaseRequest from "../../types/PurchaseRequest";
import { AssetRequestStatus } from "../../constants/AssetRequestStatus";
import { IRequestDocument } from "./DashboardTypes";
import { getRequestsByuser } from "../../services/requestService";

interface MyRequestComponentProps {
    request: IPurchaseRequest[] | null;
}

const MyRequestComponent: FC<MyRequestComponentProps> = ({ request }) => {
    const [requestPurpose, setRequestPurpose] = useState<string | undefined>();
    const [status, setStatus] = useState<string>();
    const [selectedRequestNumber, setSelectedRequestNumber] = useState<any>("");
    const [isReadOnlyRequest, setIsReadOnlyRequest] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedComments, setSelectedComments] = useState<string>("");
    const [selectedPriority, setSelectedPriority] = useState<any>();
    const [selectedCategory, setSelectedCategory] = useState<any>();
    const [selectedNetworkCompany, setSelectedNetworkCompany] = useState<
        string | null
    >();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [successMessage, setSuccessMessage] = useState<string | undefined>();
    const [requests, setRequests] = useState<IPurchaseRequest[] | null>();

    useEffect(() => {
        getUserRequestData();
    }, []);

    const getUserRequestData = async () => {
        setIsLoading(true);
        getRequestsByuser()
            .then((response: IPurchaseRequest[]) => {
                if (response.length > 0) {
                    var filteredRequestList: any = response.map(
                        (request) =>
                            ({
                                requestID: request.requestID,
                                requestNumber: request.purchaseRequestNumber,
                                networkCompanyId: request.networkCompanyId,
                                purpose: request.purpose,
                                comments: request.comments,
                                status: request.status,
                                active: request.active,
                                approverName: request.approverName,
                                approvedBy: request.approvedBy,
                                iTRequestNumber: request.iTRequestNumber,
                                priority: request.priority,
                                categoryId: request.categoryId,
                                categoryName: request.categoryName,
                            } as unknown as IRequestDocument)
                    );

                    setRequests(filteredRequestList);
                } else setRequests([]);
                setIsLoading(false);
            })
            .catch((err) => setRequests(null));
        setIsLoading(false);
    };

    const _myRequestColumns: IColumn[] = [
        {
            key: "requestNumber",
            name: "Request Number",
            fieldName: "requestNumber",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IRequestDocument) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            viewAssetRequest(
                                item?.requestNumber,
                                item?.purpose,
                                item?.priority,
                                item?.categoryId,
                                item?.networkCompanyId,
                                item?.comments,
                                item?.status
                            );
                        }}
                    >
                        {item?.requestNumber}
                    </Link>
                );
            },
        },
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IRequestDocument) => {
                return item?.categoryName;
            },
        },
        {
            key: "approverName",
            name: "Approver Name",
            fieldName: "approverName",
            minWidth: 150,
            isResizable: true,
            onRender: (item: IRequestDocument) => {
                return item?.approverName;
            },
        },
        {
            key: "status",
            name: "Status",
            fieldName: "status",
            minWidth: 100,
            isResizable: true,
        },
    ];

    const viewAssetRequest = (
        requestNumber: string,
        purpose: string,
        priority: string,
        categoryId: string,
        networkCompanyId: string,
        comments: string,
        status: string
    ) => {
        if (status !== AssetRequestStatus.Submitted) {
            setIsReadOnlyRequest(true);
        } else {
            setIsReadOnlyRequest(false);
        }

        setSelectedRequestNumber(requestNumber);
        setRequestPurpose(purpose);
        setSelectedPriority(priority);
        setSelectedCategory(categoryId);
        setSelectedNetworkCompany(networkCompanyId);
        setSelectedComments(comments);
        setStatus(status);
        setIsOpen(true);
    };

    const onSubmitHandle = () => {
        setSelectedRequestNumber("");
        setRequestPurpose("");
        setSelectedPriority("");
        setSelectedCategory("");
        setSelectedNetworkCompany("");
        setSelectedComments("");
        setStatus("");
        setIsOpen(true);
    };

    return (
        <>
            <DashboardModal
                requestNumber={selectedRequestNumber}
                isReadOnlyRequest={isReadOnlyRequest}
                purpose={requestPurpose}
                priority={selectedPriority}
                setSuccessMessage={setSuccessMessage}
                category={selectedCategory}
                networkCompanyId={selectedNetworkCompany ?? null}
                comment={selectedComments}
                status={status}
                openModal={isOpen}
                dismissModal={(value: boolean) => {
                    setIsOpen(false);
                    setIsReadOnlyRequest(false);
                    if (value === false) {
                        getUserRequestData();
                    }
                }}
            />
            <PageTemplate
                heading=""
                isLoading={requests === undefined || isLoading}
                errorOccured={requests === null}
                setSuccessMessageBar={setSuccessMessage}
                successMessageBar={successMessage}
                headerElementRight={
                    <Stack
                        horizontal
                        styles={{
                            root: {
                                marginBottom: 30,
                                justifyContent: "flex-end",
                                paddingRight: 30,
                            },
                        }}
                    >
                        <PrimaryButton
                            onClick={onSubmitHandle}
                            text="Create new request"
                        />
                    </Stack>
                }
            >
                {requests && (
                    <StyledDetailsList
                        data={requests}
                        columns={_myRequestColumns}
                        emptymessage="No requests found"
                    />
                )}
            </PageTemplate>
        </>
    );
};

export default MyRequestComponent;
