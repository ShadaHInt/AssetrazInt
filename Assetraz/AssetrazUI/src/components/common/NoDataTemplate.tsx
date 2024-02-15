import { mergeStyleSets, MessageBar } from "@fluentui/react";

const styles = mergeStyleSets({
    noData: {
        align: "left",
        width: "100%",
        height: "20px",
        fontStyle: "italic",
        color: "var(--primary-blue)",
        backgroundColor: "var(--white)",

        "& .ms-MessageBar-text": {
            fontSize: "16px",
            fontWeight: "var(--font-weight-regular)",
        },
    },
});

interface IContent {
    content: string;
}

const NoDataTemplate = (props: IContent) => {
    const content = props.content;
    return (
        <MessageBar delayedRender={true} role="none" className={styles.noData}>
            {`${content}`}
        </MessageBar>
    );
};

export default NoDataTemplate;
