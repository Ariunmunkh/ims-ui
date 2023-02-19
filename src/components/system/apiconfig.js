export const getBaseURL = () => {
    let apiBaseUrl = 'http://188.166.242.38:8080';
    if (window?.location?.hostname === 'localhost' && false) {
        apiBaseUrl = 'http://localhost:8080/';
    }
    return apiBaseUrl;
}