
using AutoMapper;

namespace stagevoorbereiding_API.DAL
{
    public class EmployeesDAO
    {
        private readonly DataBaseContext _context;

        public EmployeesDAO(DataBaseContext context)
        {
            this._context = context;
        }

        internal List<EmployeeDTO> GetAllEmployees()
        {
            return _context.Employees.ToList();
        }
    }
}