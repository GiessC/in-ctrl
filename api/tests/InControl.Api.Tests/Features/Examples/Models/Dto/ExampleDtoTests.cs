using FluentAssertions;
using InControl.Api.Features.Examples.Models.Dto;

namespace InControl.Api.Tests.Features.Examples.Models.Dto;

public class ExampleDtoTests
{
    [Fact]
    public void Constructor()
    {
        // Given
        var repositoryId = Guid.Parse("3784cc91-9d5d-455e-8094-85613c4c66ff");
        var exampleId = Guid.Parse("2a86c9e5-3e19-4cef-9618-3414bc2a17a3");
        var name = "Test";

        // When
        var exampleDto = new ExampleDto(repositoryId, exampleId) { Name = name, };

        // Then
        exampleDto.Pk.Should().Be($"REPO#{repositoryId}#EXAMPLE#{exampleId}");
        exampleDto.Sk.Should().Be($"REPO#{repositoryId}#EXAMPLE");
        exampleDto.RepositoryId.Should().Be(repositoryId);
        exampleDto.ExampleId.Should().Be(exampleId);
        exampleDto.Name.Should().Be(name);
    }
}
