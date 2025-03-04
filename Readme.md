git clone https://github.com/panva/node-oidc-provider.git

client config in example/support/configuration.js

{
  client_id: 'oidcCLIENT',
  token_endpoint_auth_method: 'none',
  grant_types: ['refresh_token', 'authorization_code'],
  redirect_uris: ['http://localhost:4200/'],
  post_logout_redirect_uris: ['http://localhost:4200/'],
}

Replace default CORS in `defaults.js`

```
function clientBasedCORS(ctx, origin, client) {
  return true; //probably not safe, but good for minimal example
}
```

## Start a new Angular project

```
$ ng new client
```

### Install angular-auth-oidc-client, select `OIDC Code Flow PKCE using iframe silent renew`, point at `http://localhost:3000`

```
$ ng add angular-auth-oidc-client
ℹ Using package manager: npm
✔ Found compatible package version: angular-auth-oidc-client@19.0.0.
✔ Package information loaded.

The package angular-auth-oidc-client@19.0.0 will be installed and executed.
Would you like to proceed? Yes
✔ Packages successfully installed.
? What flow to use? OIDC Code Flow PKCE using iframe silent renew
? Please enter your authority URL or Azure tenant id or Http config URL http://localhost:3000
    🔎 Running checks...
    ✅️ Project found, working with 'client'
    ✅️ Added "angular-auth-oidc-client" 19.0.0
    🔍 Installing packages...
    ✅️ 'src/app/auth/auth.config.ts' will be created
    ✅️ All imports done, please add the 'provideRouter()' as well if you don't have it provided yet.
CREATE src/app/auth/auth.config.ts (617 bytes)
CREATE src/silent-renew.html (678 bytes)
UPDATE package.json (1120 bytes)
UPDATE src/app/app.config.ts (367 bytes)
UPDATE angular.json (2630 bytes)
✔ Packages installed successfully.
```

Modify the `auth.config.ts`


```
authority: 'http://localhost:3000',
redirectUrl: window.location.origin,
postLogoutRedirectUri: window.location.origin,
clientId: '',
scope: 'profile',
responseType: 'code',
silentRenew: true,
silentRenewUrl: window.location.origin + '/silent-renew.html',
```

Add `provideHttpClient()` to `app.config.ts` `providers`

`app.component.ts`

```
  userData: any = null;

  constructor(private oidc: OidcSecurityService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.oidc
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken, idToken, configId } =
          loginResponse;
        console.log(userData);
        this.userData = userData;
      });
  }

  getWeather() {
    this.httpClient.get('http://localhost:5000/WeatherForecast').subscribe((response: any) => {
      console.log(response);
    })
  }
```

`app.component.html`  This works and shows the users first and last name after login

```
<button (click)="getWeather()">Get Weather</button>
<ng-container *ngIf="userData">
  <p>{{ userData.given_name }} {{ userData.family_name }}</p>
</ng-container>
```	



