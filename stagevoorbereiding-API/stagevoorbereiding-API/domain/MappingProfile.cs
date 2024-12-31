using AutoMapper;
using stagevoorbereiding_API.controllers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<EmployeesController, EmployeeDTO>();
        CreateMap<PlanningController, PlanningDTO>();
        CreateMap<ProjectController, ProjectDTO>();
    }
}
