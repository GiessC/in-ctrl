using System.Diagnostics.CodeAnalysis;
using FastEndpoints;
using FastEndpoints.Swagger;
using InControl.Api.Extensions.Startup;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace InControl.Api;

[ExcludeFromCodeCoverage]
internal static class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var settings = builder.LoadSettings();

        builder.Services.AddStatusChecks();
        builder.Services.AddAuthorization();
        builder
            .Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(
                JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    builder.Configuration.Bind("Settings:JwtSettings", options);
                    options.TokenValidationParameters.ValidateAudience = false;
                    options.TokenValidationParameters.NameClaimType = "cognito:username";
                }
            );
        builder.Services.AddFastEndpoints().SwaggerDocument();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddFastEndpoints();
        builder.Services.AddNLogging(settings);
        builder.Services.AddPolly(settings);
        builder.Services.AddCors();
        builder.Services.AddMvcCore().AddApiExplorer();

        var app = builder.Build();

        app.UseAuthentication().UseAuthorization();
        if (app.Environment.IsDevelopment())
        {
            app.UseFastEndpoints().UseSwaggerGen();
        }
        app.UseHttpsRedirection();
        app.UseCors(x => x.AllowAnyOrigin());
        app.MapHealthChecksUI(x => x.UIPath = "/health");

        app.Run();
    }
}
