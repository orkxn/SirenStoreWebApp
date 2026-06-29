using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SirenStore.Infrastructure.Context;
using System;
using System.IO;

namespace SirenStore.Infrastructure
{
    public class DbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // bulunduğumuz klasörden başlayarak yukarı doğru Solution klasörünü arıyoruz
            string basePath = AppDomain.CurrentDomain.BaseDirectory;

            // appsettings.json dosyasını bulana kadar üst klasörlere tırmanıyoruz
            while (!File.Exists(Path.Combine(basePath, "appsettings.json")))
            {
                var parent = Directory.GetParent(basePath);
                if (parent == null)
                {
                    // eğer bulamazsak varsayılan olarak WebAPI klasörünü zorla denetelim
                    basePath = Path.Combine(Directory.GetCurrentDirectory(), "SirenStore.WebAPI");
                    if (!Directory.Exists(basePath))
                    {
                        basePath = Directory.GetCurrentDirectory();
                    }
                    break;
                }
                basePath = parent.FullName;
            }

            // eğer üst klasörde appsettings.json yoksa, WebAPI alt klasörüne bak
            if (!File.Exists(Path.Combine(basePath, "appsettings.json")))
            {
                string webApiPath = Path.Combine(basePath, "SirenStore.WebAPI");
                if (File.Exists(Path.Combine(webApiPath, "appsettings.json")))
                {
                    basePath = webApiPath;
                }
            }

            // güvenli hale getirdiğimiz yol ile yapılandırıcıyı kuruyoruz
            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("PostgreSQLConnection");

            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}