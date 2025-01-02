using AutoMapper;
using stagevoorbereiding_API.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<EmployeeEntity, EmployeeDTO>();

        CreateMap<EmployeeProjectPlanningEntity, EmployeeProjectDTO>()
            .ForMember(dest => dest.EmployeeId, opt => opt.MapFrom(src => src.EmployeeId))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.Name))
            .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.ProjectId))
            .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project.Name))
            .ForMember(dest => dest.Hours, opt => opt.MapFrom(src => src.Hours));

        CreateMap<PlanningEntity, PlanningDTO>()
            .ForMember(dest => dest.EmployeeProjects, opt => opt.MapFrom(src => src.EmployeeProjectPlannings));
    }
}
