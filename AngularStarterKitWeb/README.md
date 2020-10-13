# Izenda AngularStarterKit (Unsupported)

## Overview
The AngularStarterKit illustrates the concepts of integrating Izenda into Angular applications.

### Q. What is in this repository?

### A. This is a simple example using a project template with Izenda Embedded into it. This repository is only an example of integrating Izenda into another application. The project template used in this scenario is used as a substitute for your application. This repository shows examples of how you might embed Izenda into your application.

 :warning: **The AngularStarterKit is designed for demonstration purposes and should not be used as an "as-is" fully-integrated solution. You can use the kit for reference or a baseline but ensure that security and customization meet the standards of your company.**

## Installation 
 
### Deploying the Izenda API & Database

This Kit requires the SampleAuthApi repository in order to successfully implement

- Create a database named 'IzendaAngular' (This is the database for the Izenda configuration. It contains report definitions, dashboards,etc.). You may use any name of your choosing, just be sure to modify the script below to use the new database name. 
- Download and execute the Izenda.sql script from the from the SampleAuthApi repository in the DbScripts directory. Please note, the database version can be found in the IzendaDBVersion table of this database. This will be necessary when obtaining the proper resources in the following steps.  

- Download and deploy the Izenda API to IIS. The API can be found on our <a href="https://downloads.izenda.com/">Downloads Page</a> in our version directories. Select the version directory that corresponds Izenda configuration database version and click the "API" resource in the directory. 

- Deploy the Izenda API to IIS. The instructions for installing the Izenda API will follow the same instructions for <a href= "https://www.izenda.com/docs/install/doc_installation_guide.html#izenda-installation-as-two-separate-sites"> installing a standalone version of the Izenda's API.</a>

- Download a copy of the <a href="https://github.com/Izenda7Series/Mvc5StarterKit/blob/master/Mvc5StarterKit/izendadb.config">izendadb.config</a> file and copy it to the root of your API deployment. Then modify the file with a valid connection string to this new database.

### Deploying the WebAPI & Database
- Run the StarterKit_Api.sql' from the SampleAuthApi repository in the DbScripts directory. This is the database for the WebApi application. It contains the users, roles, tenants used to login. You may use any name of your choosing, just be sure to modify the script below to use the new database name.
- Modify the web.config file (Line 75) in from the SampleAuthApi repository under the WebApi2StarterKit directory with a valid connection string to this new database.

```xml
  <connectionStrings>
    <add name="DefaultConnection" connectionString="[your connection string here]" providerName="System.Data.SqlClient" />
  </connectionStrings>
``` 
- Modify the 'IzendaApiUrl' value in the same web.config (Line 80) file with the url of the Izenda API.
```xml
<add key="IzendaApiUrl" value="http://localhost:9999/api/" />
```

### Deploying the Retail Database (optional)
Create the Retail database with the RetailDbScript.sql from the SampleAuthApi repository in the DbScripts directory.

### Configuring AngularStarterKitWeb
- Change the 'izendaApiEndPoint' value in the ApiEndpointConfig.ts (Line 6) file with the URL for the Izenda API.

```javascript
"WebApiUrl": "http://localhost:9999/api/",
``` 
- Open the same ApiEndpointConfig.ts (Line 4)</a> file and ensure 'apiEndPoint' is set. This will default to http://localhost:3358/ and can be left as is. 

```javascript
let apiEndPoint = "http://localhost:3358/";
``` 
- Download a copy of the EmbeddedUI. The EmbeddedUI can be found on our <a href="https://downloads.izenda.com/">Downloads Page</a> in our version directories. Select the version directory that corresponds Izenda configuration database version and click the "EmbeddedUI" resource in the directory. 
- Extract the files of the EmbeddedUI and place them in the src/assets/izenda folder of your Angular Kit.

- Open a command-line window at root folder AngularStarterKitWeb and run the following commands:
```bash
npm install
``` 
```bash
npm start
``` 
- Use the following commands to build deployment package:
```bash
npm install
``` 
```bash
npm run build
``` 

### Run WebApi2StarterKit in Visual Studio
- Build and run the WebApi2StarterKit project from the SampleAuthApi Repository and login with the System Admin account below:<br />
   Tenant: <br />
   Username: IzendaAdmin@system.com<br />
   Password: Izenda@123<br />

- Once you have logged in successfully, navigate to the Settings tab and enter your Izenda License Key .
- Now navigate to Settings > Data Setup > Connection String and replace the current connection string with the one you created for the Retail Database.

- Click Reconnect and then save


## Post Installation

 :warning: In order to ensure smooth operation of this kit, the items below should be reviewed.
 
 
### Exporting

Update the WebUrl value in the IzendaSystemSetting table with the URL for your front-end. You can use the script below to accomplish this. As general best practice, we recommend backing up your database before making any manual updates.

```sql

UPDATE [IzendaSystemSetting]
SET [Value] = '<your url here including the trailing slash>'
WHERE [Name] = 'WebUrl'

``` 

If you do not update this setting, charts and other visualizations may not render correctly when emailed or exported. This will also be evident in the log files as shown below:

`[ERROR][ExportingLogic ] Convert to image:
System.Exception: HTML load error. The remote content was not found at the server - HTTP error 404`

</br>

### Authentication Routes

Ensure that the AuthValidateAccessTokenUrl and AuthGetAccessTokenUrl values in the IzendaSystemSetting table use the fully qualified path to those API endpoints. 

Examples:

| Name                       | Value                                                   | 
| -------------------------- |:--------------------------------------------------------|
| AuthValidateAccessTokenUrl |http://localhost:3358/api/account/validateIzendaAuthToken|
| AuthGetAccessTokenUrl      |http://localhost:3358/api/account/GetIzendaAccessToken   |

</br>

You can use the script below to accomplish this. As general best practice, we recommend backing up your database before making any manual updates.

```sql

UPDATE [IzendaSystemSetting]
SET [Value] = '<your url here>'
WHERE [Name] = 'AuthValidateAccessTokenUrl'

UPDATE [IzendaSystemSetting]
SET [Value] = '<your url here>'
WHERE [Name] = 'AuthGetAccessTokenUrl'

``` 

:no_entry: If these values are not set, the authentication will not work properly.

## Further details about Izenda integration

- <a href="https://www.izenda.com/docs/install/.install.html">Installation and Maintenance Guide<a/>
- <a href="https://www.izenda.com/docs/dev/.developer_guide.html">Developer Guide</a>
- <a href="https://www.izenda.com/docs/dev/.developer_guide_integrated_scenarios.html">Developer Guide for Integrated Scenarios</a>

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

# More Angular Information

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
