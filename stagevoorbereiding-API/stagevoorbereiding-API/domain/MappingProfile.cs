using AutoMapper;
using stagevoorbereiding_API.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<EmployeeEntity, EmployeeDTO>().ReverseMap();
        CreateMap<ProjectEntity, ProjectDTO>().ReverseMap();
        CreateMap<PlanningEntity, PlanningDTO>().ReverseMap();
    }
}
