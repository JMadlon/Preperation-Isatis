using AutoMapper;
using stagevoorbereiding_API.Entities;

namespace stagevoorbereiding_API.DAL
{
    public class EmployeesDAO
    {
        private readonly DataBaseContext _context;
        private IMapper _mapper;

        public EmployeesDAO(DataBaseContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;
        }

        public List<EmployeeDTO> GetAllEmployees()
        {
            List<EmployeeEntity> employees = _context.Employees.ToList();
            return _mapper.Map<List<EmployeeDTO>>(employees);
        }

        public bool UpdateEmployee(EmployeeDTO employee)
        {
            EmployeeEntity? existingEmployee = _context.Employees.FirstOrDefault(e => e.Id == employee.Id);

            if (existingEmployee == null)
            {
                return false;
            }

            _mapper.Map(employee, existingEmployee);

            _context.SaveChanges();
            return true;
        }

        public bool DeleteEmployee(int id)
        {
            var employee = _context.Employees.FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return false;
            }

            _context.Employees.Remove(employee);
            _context.SaveChanges();
            return true;
        }

        public bool AddEmployee(EmployeeDTO employee)
        {
            try
            {
                _context.Employees.Add(_mapper.Map<EmployeeEntity>(employee));
                _context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


    }
}