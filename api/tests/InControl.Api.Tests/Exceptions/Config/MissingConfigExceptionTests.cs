using FluentAssertions;
using InControl.Api.Exceptions.Config;

namespace InControl.Api.Tests.Exceptions.Config;

public class MissingConfigExceptionTests
{
    [Fact]
    public void Creates_With_Correct_Message()
    {
        // Given
        var key = "Test";

        // When
        var exception = new MissingConfigException(key);

        // Then
        exception.Message.Should().Be($"Configuration key '{key}' is missing.");
    }
}
