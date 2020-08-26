export class ApiEndpointConfig {
    public static getPath(value: string): string {
        const apiEndPoint = 'http://localhost:3358/';
        switch (value) {
            case 'register':
                return apiEndPoint + 'api/Account/Register';
          case 'login':
            return apiEndPoint + 'Token';//'api/Account/ExternalLogin';//'Token';
            case 'logout':
                return apiEndPoint + 'api/Account/Logout';
            case 'getizendatoken':
                return apiEndPoint + 'api/User/GenerateToken';
            case 'createtenant':
                return apiEndPoint + 'api/Account/CreateTenant';
          case 'createuser':
                return apiEndPoint + 'api/Account/CreateUser';
            default:
                return '';
        }
    }
}
