using Microsoft.EntityFrameworkCore;

namespace stagevoorbereiding_API.dal
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions<DbContext> options) : base(options)
        {
        }
        
    }
}