export class ApiEndpointConfig {
    public static getPath(value: string): string {
        // The following line defines the URL to the authentication application (the WebApi2StarterKit or your application)
        const apiEndPoint = 'http://localhost:3358/';
        // The following line defines the URL to the IzendaAPI
        const izendaApiEndPoint = 'http://localhost:9999/';
        switch (value) {
            case 'register':
                return apiEndPoint + 'api/Account/Register';
            case 'login':
                return apiEndPoint + 'Token';
            case 'logout':
                return apiEndPoint + 'api/Account/Logout';
            case 'getizendatoken':
                return apiEndPoint + 'api/User/GenerateToken';
            case 'izendaAPI':
                return izendaApiEndPoint + 'api';
            case 'authAPI':
                return apiEndPoint + 'api';
            default:
                return '';
        }
    }
}
