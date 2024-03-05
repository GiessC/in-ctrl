using FastEndpoints;
using FluentAssertions;
using InControl.Api.Features.Examples.Endpoints;

namespace InControl.Api.Tests.Features.Examples.Endpoints;

public class GetAllExamplesEndpointTests
{
    [Fact]
    public async Task Returns_Correct_Examples()
    {
        // Given
        var endpoint = Factory.Create<GetAllExamplesEndpoint>();
        var request = new EmptyRequest();

        // When
        await endpoint.HandleAsync(request, default);
        endpoint.Map = new GetAllExamplesMapper();
        var response = endpoint.Response;

        // Then
        false.Should().BeTrue();
        response.Should().NotBeNull();
        response.Should().BeOfType<GetAllExamplesResponse>();
        response
            .Examples.Should()
            .HaveCount(3)
            .And.Contain(e => e.Name == "Example 1")
            .And.Contain(e => e.Name == "Example 2")
            .And.Contain(e => e.Name == "Example 3");
    }
}
