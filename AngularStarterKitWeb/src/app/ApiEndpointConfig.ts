export class ApiEndpointConfig {
    public static getPath(value: string): string {
        const apiEndPoint = 'http://izauthapi.azurewebsites.net/';
        switch (value) {
            case 'register':
                return apiEndPoint + 'api/Account/Register';
            case 'login':
                return apiEndPoint + 'Token';
            case 'logout':
                return apiEndPoint + 'api/Account/Logout';
            case 'getizendatoken':
                return apiEndPoint + 'api/User/GenerateToken';
            default:
                return '';
        }
    }
}