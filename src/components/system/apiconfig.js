export const getBaseURL = () => {
    let apiBaseUrl = 'http://103.253.147.44';

    if (window?.location?.hostname !== 'localhost') {
        apiBaseUrl = 'http://' + window?.location?.hostname + ":80";
    }
    return apiBaseUrl;
}