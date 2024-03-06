namespace InControl.Api.Features.Examples.Models.Dto;

public class ExampleDto(Guid repositoryId, Guid exampleId)
{
    private const string PK_PREFIX = "REPO#";
    private const string PK_SUFFIX = "#EXAMPLE#";
    private const string SK_SUFFIX = "#EXAMPLE";
    public readonly string Pk = CreatePk(repositoryId, exampleId);
    public readonly string Sk = CreateSk(repositoryId);
    public readonly Guid RepositoryId = repositoryId;
    public readonly Guid ExampleId = exampleId;
    public string Name { get; set; } = default!;

    private static string CreatePk(Guid repositoryId, Guid exampleId)
    {
        return $"{PK_PREFIX}{repositoryId}{PK_SUFFIX}{exampleId}";
    }

    private static string CreateSk(Guid repositoryId)
    {
        return $"{PK_PREFIX}{repositoryId}{SK_SUFFIX}";
    }
}
