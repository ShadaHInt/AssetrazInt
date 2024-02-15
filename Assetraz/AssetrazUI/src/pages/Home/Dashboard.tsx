//React
import * as React from "react";
import { useState } from "react";

//UI Styles
import { Pivot, PivotItem } from "@fluentui/react";

//Services
import { getRequestsByuser } from "../../services/requestService";
import IPurchaseRequest from "../../types/PurchaseRequest";

//Components
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IRequestDocument, Props } from "./DashboardTypes";
import MyRequestComponent from "./MyRequestComponent";
import MyAssetsComponent from "./MyAssetsComponent";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FunctionComponent<Props> = (props) => {
    const email = props.email;

    const [requests, setRequests] = useState<IPurchaseRequest[] | null>();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    const navigate = useNavigate();

    React.useEffect(() => {
        const tab = new URLSearchParams(window.location.search).get("tab");
        setSelectedTab(tab || "");
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

    return (
        <div style={{ width: "100%" }}>
            {!isLoading ? (
                <div>
                    <Pivot
                        onLinkClick={(item?: PivotItem) => {
                            if (item) {
                                navigate(`?tab=${item.props.itemKey}`);
                            }
                            setSelectedTab(item?.props.itemKey ?? null);
                        }}
                        selectedKey={selectedTab}
                    >
                        <PivotItem headerText="My Assets" itemKey="my-asset">
                            <MyAssetsComponent
                                getUserRequestData={getUserRequestData}
                                email={email}
                            />
                        </PivotItem>
                        <PivotItem headerText="My Request" itemKey="my-request">
                            <MyRequestComponent request={requests ?? []} />
                        </PivotItem>
                        {/* <PivotItem headerText="My Maintenance Requests">
                            <MaintenanceRequest />
                        </PivotItem> */}
                    </Pivot>
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
};
