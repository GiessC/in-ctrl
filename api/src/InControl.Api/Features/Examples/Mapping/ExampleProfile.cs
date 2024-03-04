using AutoMapper;
using InControl.Api.Features.Examples.Models.Domain;
using InControl.Api.Features.Examples.Models.Dto;

namespace InControl.Api.Features.Examples.Mapping;

public class ExampleProfile : Profile
{
    public ExampleProfile()
    {
        CreateMap<ExampleDto, Example>()
            .ForSourceMember(x => x.Pk, opt => opt.DoNotValidate())
            .ForSourceMember(x => x.Sk, opt => opt.DoNotValidate());
        CreateMap<Example, ExampleDto>();
    }
}
