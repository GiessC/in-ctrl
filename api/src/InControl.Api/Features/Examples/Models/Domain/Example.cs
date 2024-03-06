namespace InControl.Api.Features.Examples.Models.Domain;

public class Example(Guid repositoryId, Guid? exampleId = null)
{
    public readonly Guid RepositoryId = repositoryId;
    public readonly Guid ExampleId = exampleId ?? Guid.NewGuid();
    public string Name { get; set; } = default!;
}
