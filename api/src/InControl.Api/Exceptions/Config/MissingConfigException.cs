namespace InControl.Api.Exceptions.Config;

public class MissingConfigException(string key)
    : Exception($"Configuration key '{key}' is missing.") { }
