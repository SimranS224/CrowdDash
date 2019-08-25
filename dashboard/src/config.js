let serverUrl;

if (process.env.REACT_APP_ENV === 'production') {
    serverUrl = "";
} else {
    serverUrl = 'http://localhost:8080';
}

export { serverUrl }