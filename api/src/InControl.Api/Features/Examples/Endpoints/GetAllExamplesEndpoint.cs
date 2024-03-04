using System.Net;
using FastEndpoints;
using InControl.Api.Features.Examples.Models.Domain;

namespace InControl.Api.Features.Examples.Endpoints;

public class GetAllExamplesEndpoint
    : Endpoint<EmptyRequest, GetAllExamplesResponse, GetAllExamplesMapper>
{
    public override void Configure()
    {
        Get("/");
        AllowAnonymous();
        Group<ExampleGroup>();
    }

    public override async Task HandleAsync(EmptyRequest request, CancellationToken ct)
    {
        var examples = new List<Example>
        {
            new(Guid.NewGuid(), Guid.NewGuid()) { Name = "Example 1" },
            new(Guid.NewGuid(), Guid.NewGuid()) { Name = "Example 2" },
            new(Guid.NewGuid(), Guid.NewGuid()) { Name = "Example 3" }
        };
        var response = Map.FromEntity(examples);
        await SendAsync(response, (int)HttpStatusCode.OK, ct);
    }
}

#region Models
public record GetAllExamplesResponse
{
    public IEnumerable<Example> Examples { get; init; } = Enumerable.Empty<Example>();
}
#endregion

#region Map
public class GetAllExamplesMapper
    : Mapper<EmptyRequest, GetAllExamplesResponse, IEnumerable<Example>>
{
    public override GetAllExamplesResponse FromEntity(IEnumerable<Example> examples)
    {
        return new GetAllExamplesResponse { Examples = examples };
    }
}
#endregion
