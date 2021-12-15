import React from 'react';

export const ErrorContext = React.createContext({});

export class ErrorContextProvider extends React.Component {
    static hasError = false;

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError(error) {
        let errorCode;
        let requestURL;
        if ('isAxiosError' in error && error.isAxiosError) {
            requestURL = error.config.url;
            const status = error.response?.status;
            errorCode = status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR';
        } else {
            errorCode = 'GENERAL_ERROR';
        }

        ErrorContextProvider.hasError = true;
        return {errorCode, error, requestURL};
    }

    componentDidCatch() {
        ErrorContextProvider.hasError = false;
    }

    render() {
        const {errorCode, error, requestURL} = this.state;
        const value = ErrorContextProvider.hasError ? {errorCode, error, requestURL} : {};
        const {children} = this.props;
        return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
    }
}