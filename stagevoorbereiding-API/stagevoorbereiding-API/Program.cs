using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.DAL;
using stagevoorbereiding_API.services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddScoped<EmployeesDAO>();
builder.Services.AddScoped<EmployeesService>();
builder.Services.AddScoped<PlanningDAO>();
builder.Services.AddScoped<PlanningService>();
builder.Services.AddScoped<ProjectsDAO>();
builder.Services.AddScoped<ProjectsService>();

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    containerBuilder.RegisterType<EmployeesDAO>().AsSelf().InstancePerLifetimeScope();
    containerBuilder.RegisterType<PlanningDAO>().AsSelf().InstancePerLifetimeScope();
    containerBuilder.RegisterType<ProjectsDAO>().AsSelf().InstancePerLifetimeScope();
});

var app = builder.Build();

app.MapControllers();
app.Run();
