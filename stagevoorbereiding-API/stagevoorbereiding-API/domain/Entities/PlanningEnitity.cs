using System.Collections.Generic;

namespace stagevoorbereiding_API.Entities
{
    public class PlanningEntity
    {
        public int Id { get; set; }
        public int Week { get; set; }
        public int Hours { get; set; }
        public EmployeeEntity Employee { get; set; }
        public ProjectEntity Project { get; set; }
    }
}
