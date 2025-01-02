using System.Collections.Generic;

namespace stagevoorbereiding_API.Entities
{
    public class PlanningEntity
    {
        public int Id { get; set; }

        public int Week { get; set; }

        public ICollection<EmployeeProjectPlanningEntity> EmployeeProjectPlannings { get; set; } = new List<EmployeeProjectPlanningEntity>();
    }
}
