using System.Threading.RateLimiting;
using HealthChecks.ApplicationStatus.DependencyInjection;
using InControl.Api.Config;
using NLog;
using Polly;
using Polly.Retry;
using Polly.Timeout;

namespace InControl.Api.Extensions.Startup;

public static class StartupExtensions
{
    public static IConfigurationSection LoadSettings(this WebApplicationBuilder builder)
    {
        builder.Configuration.AddJsonFile(
            "appsettings.json",
            optional: false,
            reloadOnChange: true
        );
        builder.Configuration.AddJsonFile(
            "appsettings.Development.json",
            optional: true,
            reloadOnChange: true
        );
        builder.Configuration.AddJsonFile(
            "appsettings.Local.json",
            optional: true,
            reloadOnChange: true
        );
        var settings = builder.Configuration.GetSection(Settings.KEY_NAME);
        builder.Services.Configure<Settings>(settings);
        return settings;
    }

    public static void AddNLogging(this IServiceCollection _, IConfigurationSection settings)
    {
        LogManager
            .Setup()
            .LoadConfiguration(logBuilder =>
            {
                logBuilder
                    .ForLogger("InControl.Api")
                    .FilterMinLevel(
                        NLog.LogLevel.AllLoggingLevels.First(x =>
                            x.Name.Equals(settings.GetValue<string>("Logging:LogLevel"))
                        )
                    )
                    .WriteToColoredConsole();
            });
    }

    public static void AddPolly(this IServiceCollection services, IConfigurationSection settings)
    {
        services.AddResiliencePipeline(
            "InControl.Api",
            pipelineBuilder =>
            {
                pipelineBuilder
                    .AddRetry(
                        new RetryStrategyOptions()
                        {
                            Name = "InControl.Api Retry",
                            Delay = TimeSpan.FromSeconds(
                                settings.GetValue<int>("Polly:RetryDelaySeconds")
                            ),
                            MaxRetryAttempts = settings.GetValue<int>("Polly:MaxRetryAttempts"),
                            BackoffType = DelayBackoffType.Exponential,
                            UseJitter = true,
                        }
                    )
                    .AddTimeout(
                        new TimeoutStrategyOptions()
                        {
                            Name = "InControl.Api Timeout",
                            OnTimeout = (OnTimeoutArguments args) =>
                            {
                                Logger logger = LogManager.GetLogger("InControl.Api");
                                logger.Warn(
                                    $"{args.Context.OperationKey}: Execution timed out after {args.Timeout.TotalSeconds} seconds."
                                );
                                return new ValueTask();
                            },
                            Timeout = TimeSpan.FromSeconds(
                                settings.GetValue<int>("Polly:TimeoutSeconds")
                            ),
                        }
                    )
                    .AddRateLimiter(
                        new SlidingWindowRateLimiter(
                            new SlidingWindowRateLimiterOptions()
                            {
                                AutoReplenishment = true,
                                PermitLimit = settings.GetValue<int>("Polly:RateLimitPermitLimit"),
                                QueueLimit = settings.GetValue<int>("Polly:RateLimitQueue"),
                                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                                SegmentsPerWindow = settings.GetValue<int>(
                                    "Polly:RateLimitSegmentsPerWindow"
                                ),
                                Window = TimeSpan.FromSeconds(
                                    settings.GetValue<int>("Polly:RateLimitTimeWindowSeconds")
                                )
                            }
                        )
                    );
            }
        );
    }

    public static void AddStatusChecks(this IServiceCollection services)
    {
        services.AddHealthChecks().AddApplicationStatus();
        services
            .AddHealthChecksUI(x =>
                x.AddHealthCheckEndpoint("InControl.Api", "/health").DisableDatabaseMigrations()
            )
            .AddInMemoryStorage();
    }
}
