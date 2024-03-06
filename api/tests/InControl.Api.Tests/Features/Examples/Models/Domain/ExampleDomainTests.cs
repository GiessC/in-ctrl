using FluentAssertions;
using InControl.Api.Features.Examples.Models.Domain;

namespace InControl.Api.Tests.Features.Examples.Models.Domain;

public class ExampleDomainTests
{
    [Fact]
    public void Assigns_Guid_When_Specified()
    {
        // Given
        var repositoryId = Guid.Parse("f6ff824e-52c9-5810-bac6-88d4a762ae8d");
        var exampleId = Guid.Parse("c3dc3f3d-8e77-4347-8405-436116c6e9f5");

        // When
        var example = new Example(repositoryId, exampleId);

        // Then
        example.ExampleId.Should().NotBeEmpty();
    }

    [Fact]
    public void Generates_Guid_When_Not_Specified()
    {
        // Given
        var repositoryId = Guid.Parse("f6ff824e-52c9-5810-bac6-88d4a762ae8d");

        // When
        var example = new Example(repositoryId);

        // Then
        example.ExampleId.Should().NotBeEmpty();
    }
}
