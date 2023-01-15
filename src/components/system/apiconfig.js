export const getBaseURL = () => {
    let apiBaseUrl = 'http://206.189.153.33:8080';

    if (window?.location?.hostname !== 'localhost') {
        apiBaseUrl = 'http://' + window?.location?.hostname + ":8080";
    }
    return apiBaseUrl;
}