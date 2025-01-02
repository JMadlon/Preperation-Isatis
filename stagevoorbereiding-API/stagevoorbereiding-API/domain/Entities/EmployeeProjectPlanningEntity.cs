using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace stagevoorbereiding_API.Entities
{
    public class EmployeeProjectPlanningEntity
    {
        [Key]
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public EmployeeEntity Employee { get; set; }

        public int ProjectId { get; set; }
        public ProjectEntity Project { get; set; }

        public int PlanningId { get; set; }
        public PlanningEntity Planning { get; set; }

        public int Hours { get; set; }
    }
}
