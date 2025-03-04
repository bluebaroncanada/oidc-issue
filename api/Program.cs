using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme).AddOpenIdConnect(options =>
{
    options.Authority = "http://localhost:3000";
    options.RequireHttpsMetadata = false;
    options.ClientId = "oidcCLIENT";
    options.GetClaimsFromUserInfoEndpoint = true;
});

builder.Services.AddAuthentication(BearerTokenDefaults.AuthenticationScheme).AddBearerToken(options =>
{
    options.ClaimsIssuer = "http://localhost:3000";
});

var app = builder.Build();

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyOrigin();
    options.AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
