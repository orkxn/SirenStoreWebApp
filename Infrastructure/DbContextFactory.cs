using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SirenStore.Infrastructure.Context;
using System;
using System.Globalization;
using System.IO;

namespace SirenStore.Infrastructure
{
    public class DbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
            Thread.CurrentThread.CurrentUICulture = CultureInfo.InvariantCulture;
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

            // .env dosyasını yükle (Program.cs'deki DotEnv.Load() ile aynı mantık)
            // .env dosyası WebAPI klasöründe veya solution kökünde olabilir
            LoadEnvFile(basePath);

            // güvenli hale getirdiğimiz yol ile yapılandırıcıyı kuruyoruz
            // AddEnvironmentVariables() ile .env'den yüklenen değerler de okunur
            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("PostgreSQLConnection");

            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }

        /// <summary>
        /// .env dosyasını bulup environment variable olarak yükler.
        /// dotenv.net paketi Infrastructure projesinde olmayabileceği için manuel parse eder.
        /// </summary>
        private static void LoadEnvFile(string basePath)
        {
            // Önce basePath'te (WebAPI klasörü), sonra solution kökünde ara
            string? envFilePath = null;

            if (File.Exists(Path.Combine(basePath, ".env")))
            {
                envFilePath = Path.Combine(basePath, ".env");
            }
            else
            {
                // Solution kökünde ara
                var solutionRoot = Directory.GetParent(basePath)?.FullName;
                if (solutionRoot != null && File.Exists(Path.Combine(solutionRoot, ".env")))
                {
                    envFilePath = Path.Combine(solutionRoot, ".env");
                }
            }

            if (envFilePath == null) return;

            foreach (var line in File.ReadAllLines(envFilePath))
            {
                var trimmed = line.Trim();
                if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("#"))
                    continue;

                var separatorIndex = trimmed.IndexOf('=');
                if (separatorIndex <= 0) continue;

                var key = trimmed.Substring(0, separatorIndex).Trim();
                var value = trimmed.Substring(separatorIndex + 1).Trim();

                // Tırnak işaretlerini kaldır
                if (value.Length >= 2 &&
                    ((value.StartsWith("\"") && value.EndsWith("\"")) ||
                     (value.StartsWith("'") && value.EndsWith("'"))))
                {
                    value = value.Substring(1, value.Length - 2);
                }

                Environment.SetEnvironmentVariable(key, value);
            }
        }
    }
}