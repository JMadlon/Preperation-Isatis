using System.Collections.Generic;

namespace stagevoorbereiding_API.Entities
{
    public class EmployeeEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ContractHours { get; set; }

        public ICollection<EmployeeProjectPlanningEntity> EmployeeProjectPlannings { get; set; } = new List<EmployeeProjectPlanningEntity>();
    }
}
