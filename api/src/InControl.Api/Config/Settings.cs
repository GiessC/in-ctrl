namespace InControl.Api.Config;

public class Settings
{
    public static readonly string KEY_NAME = "Settings";
    public int RetryDelaySeconds { get; set; }
    public int MaxRetryAttempts { get; set; }
    public int TimeoutSeconds { get; set; }
    public LoggingSettings Logging { get; set; } = default!;
}

public class LoggingSettings
{
    public string LogLevel { get; set; } = default!;
}
