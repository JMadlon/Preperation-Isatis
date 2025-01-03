public class PlanningDTO
{
        public int Id { get; set; }
        public int Week { get; set; }
        public int Hours { get; set; }
        public EmployeeDTO Employee { get; set; }
        public ProjectDTO Project { get; set; }
}   