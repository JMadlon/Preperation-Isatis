using System.ComponentModel;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.DAL;
using stagevoorbereiding_API.services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Services.AddScoped<EmployeesDAO>();
builder.Services.AddScoped<EmployeesService>();

builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    containerBuilder.RegisterType<EmployeesDAO>().AsSelf().SingleInstance();
    containerBuilder.RegisterType<PlanningDAO>().AsSelf().SingleInstance();
    containerBuilder.RegisterType<ProjectsDAO>().AsSelf().SingleInstance();
});

WebApplication app = builder.Build();
app.MapControllers();
app.Run();
