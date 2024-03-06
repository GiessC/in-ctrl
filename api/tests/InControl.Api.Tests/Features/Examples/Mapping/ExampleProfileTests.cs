using AutoMapper;
using InControl.Api.Features.Examples.Mapping;

namespace InControl.Api.Tests.Features.Examples.Mapping;

public class ExampleProfileTests
{
    [Fact]
    public void ExampleProfile_IsValid()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new ExampleProfile());
        });
        var mapper = config.CreateMapper();

        mapper.ConfigurationProvider.AssertConfigurationIsValid();
    }
}
