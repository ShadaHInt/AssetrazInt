import { MessageBar, MessageBarType } from "@fluentui/react";

interface IMessageBarProps {
    onDismiss?: () => void;
    content: string;
}

export const ErrorMessageBar = (props: IMessageBarProps) => {
    const { onDismiss, content } = props;
    return (
        <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={onDismiss}
            dismissButtonAriaLabel="Close"
        >
            {content}
        </MessageBar>
    );
};

export const SuccessMessageBar = (props: IMessageBarProps) => {
    const { content } = props;
    return (
        <MessageBar
            messageBarType={MessageBarType.success}
            dismissButtonAriaLabel="Close"
        >
            {content}
        </MessageBar>
    );
};
