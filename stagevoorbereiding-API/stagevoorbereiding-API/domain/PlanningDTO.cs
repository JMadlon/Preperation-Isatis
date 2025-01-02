public class PlanningDTO
{
    public int Id { get; set; }
    public int Week { get; set; }

    public List<EmployeeProjectDTO> EmployeeProjects { get; set; } = new List<EmployeeProjectDTO>();
}   