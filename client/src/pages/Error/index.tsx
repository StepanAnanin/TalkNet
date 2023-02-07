import React from "react";
import Page from "../../shared/UI/Page";

interface ErrorPageProps {
    message: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
    return <Page>{message}</Page>;
}
