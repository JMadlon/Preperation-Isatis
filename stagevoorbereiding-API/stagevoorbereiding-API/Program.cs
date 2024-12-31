using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using stagevoorbereiding_API.DAL;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<MappingProfile>();
    });

    containerBuilder.RegisterInstance(config).AsSelf().SingleInstance();
    containerBuilder.Register(ctx => config.CreateMapper()).As<IMapper>().SingleInstance();
});

var app = builder.Build();
app.MapControllers();
app.Run();
