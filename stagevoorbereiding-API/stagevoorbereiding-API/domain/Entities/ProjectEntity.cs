using System.Collections.Generic;

namespace stagevoorbereiding_API.Entities
{
    public class ProjectEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<PlanningEntity> Plannings { get; set; } = new List<PlanningEntity>();
    }
}
