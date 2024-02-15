import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import { useId } from "@fluentui/react-hooks";
import { FunctionComponent } from "react";

const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
};
interface IToolTipProps {
    content: any;
}

export const Tooltip: FunctionComponent<IToolTipProps> = ({
    content,
    children,
}) => {
    const tooltipId = useId("tooltip");
    return (
        <div>
            <TooltipHost
                content={content}
                id={tooltipId}
                calloutProps={calloutProps}
                styles={hostStyles}
            >
                {children}
            </TooltipHost>
        </div>
    );
};
