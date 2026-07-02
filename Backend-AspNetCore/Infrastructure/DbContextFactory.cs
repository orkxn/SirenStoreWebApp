using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SirenStore.Infrastructure.Context;
using System;
using System.Globalization;
using System.IO;
using System.Linq;

namespace SirenStore.Infrastructure
{
    public class DbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
            Thread.CurrentThread.CurrentUICulture = CultureInfo.InvariantCulture;

            var webApiPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../WebAPI"));
            if (!Directory.Exists(webApiPath)) webApiPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "WebAPI"));
            if (!Directory.Exists(webApiPath)) webApiPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../WebAPI"));

            if (File.Exists(Path.Combine(webApiPath, ".env")))
            {
                foreach (var line in File.ReadAllLines(Path.Combine(webApiPath, ".env")))
                {
                    var parts = line.Split('=', 2);
                    if (parts.Length == 2) Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim(' ', '"', '\''));
                }
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(webApiPath)
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("PostgreSQLConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException($"Connection string 'PostgreSQLConnection' is missing in {webApiPath}.");
            }

            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}