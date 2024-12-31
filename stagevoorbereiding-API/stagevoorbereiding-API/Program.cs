using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Services.AddControllers();

builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<MappingProfile>();
    });

    containerBuilder.RegisterInstance(config).AsSelf().SingleInstance();

    containerBuilder
        .Register(ctx => config.CreateMapper())
        .As<IMapper>()
        .SingleInstance();
});

var app = builder.Build();
app.MapControllers();
app.Run();
