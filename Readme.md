# How to run

in the node-oidc-provider/example directory
```
node koa.js
```

in the client folder
```
npm i
ng start
```

in the api folder
```
dotnet restore
dotnet run
```

# The two files that matter

All that should matter is the `node-oidc-provider/example/support/configuration.js` and `api/Program.cs` files.  For the client config look at `client/src/app/auth.config.ts` and `client/src/app/app.component.ts`.

`Program.cs`
```
builder.Services.AddAuthentication(BearerTokenDefaults.AuthenticationScheme).AddBearerToken(options =>
{
    options.ClaimsIssuer = "http://localhost:3000";
});
```
`configuration.js`
```
  clients: [
{
  client_id: 'oidcCLIENT',
  token_endpoint_auth_method: 'none',
  grant_types: ['refresh_token', 'authorization_code'],
  redirect_uris: ['http://localhost:4200/'],
  post_logout_redirect_uris: ['http://localhost:4200/'],
}
```

# Instructions
This is just the very basic scenario of getting Angular, node-oidc-provider, and a .Net Core API.  I've changed as few lines as possible.  It doesn't even authenticate, it just gives you back whatever you type in the username.  You can type in any name and it will authorize you.  If you look in DevTools, you'll see a call to /me in the Network tab.  That gets all the claims.  There's default example claims.  You don't have to do anything in Angular.

Login and click the GetWeather button.

The GetWeather call will return 401.  The debug says:

```
info: Microsoft.AspNetCore.Authentication.BearerToken.BearerTokenHandler[7]
      BearerToken was not authenticated. Failure message: Unprotected token failed
dbug: Microsoft.AspNetCore.Authorization.AuthorizationMiddleware[0]
      Policy authentication schemes  did not succeed
info: Microsoft.AspNetCore.Authorization.DefaultAuthorizationService[2]
      Authorization failed. These requirements were not met:
      DenyAnonymousAuthorizationRequirement: Requires an authenticated user.
info: Microsoft.AspNetCore.Authentication.BearerToken.BearerTokenHandler[12]
      AuthenticationScheme: BearerToken was challenged.
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished HTTP/1.1 GET http://localhost:5000/WeatherForecast - 401 - - 194.4449ms
```

# What I've done

git clone https://github.com/panva/node-oidc-provider.git

client config in `example/support/configuration.js`

```
{
  client_id: 'oidcCLIENT',
  token_endpoint_auth_method: 'none',
  grant_types: ['refresh_token', 'authorization_code'],
  redirect_uris: ['http://localhost:4200/'],
  post_logout_redirect_uris: ['http://localhost:4200/'],
}
```

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
clientId: 'oidcCLIENT',
scope: 'openid profile',
responseType: 'code',
silentRenew: true,
silentRenewUrl: window.location.origin + '/silent-renew.html',
renewTimeBeforeTokenExpiresInSeconds: 10,
secureRoutes: ['http://localhost:5000/',],
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
<pre>
<button (click)="getWeather()">Get Weather</button>
<ng-container *ngIf="userData">
  <p>{{ userData.given_name }} {{ userData.family_name }}</p>
</ng-container>
</pre>
```	

# API .Net Core 8 setup

```
builder.Services.AddAuthentication(BearerTokenDefaults.AuthenticationScheme).AddBearerToken(options =>
{
    options.ClaimsIssuer = "http://localhost:3000";
});

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyOrigin();
    options.AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();
```


