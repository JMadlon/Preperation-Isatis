using Microsoft.EntityFrameworkCore;

namespace stagevoorbereiding_API.DAL
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options)
        {
        }
        
        public DbSet<EmployeeDTO> Employees { get; set; }
        public DbSet<PlanningDTO> Planning { get; set; }
        public DbSet<ProjectDTO> Projects { get; set; }
    }
}