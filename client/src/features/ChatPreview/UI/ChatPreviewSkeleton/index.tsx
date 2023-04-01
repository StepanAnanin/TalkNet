import "./ChatPreviewSkeleton.scss";

export default function ChatPreviewSkeleton() {
    return (
        <div className="TNUI-ChatPreviewSkeleton">
            <div className="TNUI-ChatPreviewSkeleton-avatar" />
            <div className="TNUI-ChatPreviewSkeleton-info">
                <div className="TNUI-ChatPreviewSkeleton-top" />
                <div className="TNUI-ChatPreviewSkeleton-bottom" />
            </div>
        </div>
    );
}
