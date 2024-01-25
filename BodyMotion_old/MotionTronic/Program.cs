using MotionTronic;
using MotionTronic.Configuration;
using MotionTronic.Services;
using MotionTronic.Services.Interfaces;
using Serilog;

IHost host = Host.CreateDefaultBuilder(args)
    .UseSerilog((context, configuration) =>
    {
        configuration
            .ReadFrom.Configuration(context.Configuration)
            .Enrich.WithProperty("MachineName", Environment.MachineName)            
            .Enrich.FromLogContext();
    })
    .ConfigureServices(services =>
    {
        services.AddSingleton<ICalculationsService, KinectCalculationsService>();
        services.AddSingleton<IDataProviderService, LocalDataProviderService>();
        services.AddSingleton<IRecorderService, KinectRecorderService>();

        services.AddHostedService<Worker>();
    })
    .Build();

IConfiguration config = host.Services.GetRequiredService<IConfiguration>();
Config.InitConfig(config);

host.Run();
