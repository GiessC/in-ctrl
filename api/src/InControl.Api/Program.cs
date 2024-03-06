using System.Diagnostics.CodeAnalysis;
using FastEndpoints;
using InControl.Api.Extensions.Startup;

namespace InControl.Api;

[ExcludeFromCodeCoverage]
internal static class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var settings = builder.LoadSettings();

        builder.Services.AddStatusChecks();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddFastEndpoints();
        builder.Services.AddNLogging(settings);
        builder.Services.AddPolly(settings);
        builder.Services.AddCors();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        app.UseFastEndpoints();
        app.UseHttpsRedirection();
        app.UseCors(x => x.AllowAnyOrigin());
        app.MapHealthChecksUI(x => x.UIPath = "/health");

        app.Run();
    }
}
