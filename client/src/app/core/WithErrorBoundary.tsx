import React from "react";
import { ErrorPage } from "../../pages/Error";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    message?: string;
}

class WithErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(err: Error): ErrorBoundaryState {
        return { hasError: true, message: err.message };
    }

    public render(): React.ReactNode {
        if (this.state.hasError) {
            return <ErrorPage message={`Критическая ошибка: ${this.state.message}`} />;
        }

        return this.props.children;
    }
}

export default WithErrorBoundary;
