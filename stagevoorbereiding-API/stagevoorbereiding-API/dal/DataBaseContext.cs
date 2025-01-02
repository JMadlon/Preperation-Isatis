using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.Entities;

namespace stagevoorbereiding_API.DAL
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options)
        {
        }
        
        public DbSet<EmployeeEntity> Employees { get; set; }
        public DbSet<PlanningEntity> Planning { get; set; }
        public DbSet<ProjectEntity> Projects { get; set; }
        public DbSet<EmployeeProjectPlanningEntity> EmployeeProjectPlannings { get; set; }

    }
}