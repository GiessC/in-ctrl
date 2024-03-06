using System.Diagnostics.CodeAnalysis;
using System.Net;
using FastEndpoints;

namespace InControl.Api.Features.Examples;

public class ExampleGroup : Group
{
    [ExcludeFromCodeCoverage]
    public ExampleGroup()
    {
        Configure(
            "/example",
            ep =>
            {
                ep.Description(x =>
                    x.Produces((int)HttpStatusCode.OK)
                        .WithTags("Example")
                        .WithSummary("Example endpoints for the InControl API.")
                );
            }
        );
    }
}
