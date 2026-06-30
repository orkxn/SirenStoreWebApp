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

            // Solution kökünü bul (.slnx veya .sln dosyasının olduğu yer)
            var solutionRoot = FindSolutionRoot();

            // WebAPI klasörünü bul (appsettings.json ve .env burada)
            var webApiPath = Path.Combine(solutionRoot, "WebAPI");

            if (!Directory.Exists(webApiPath))
            {
                throw new InvalidOperationException(
                    $"WebAPI klasörü bulunamadı. Aranan yol: {webApiPath}");
            }

            // .env dosyasını yükle (Program.cs'deki DotEnv.Load() ile aynı mantık)
            LoadEnvFile(webApiPath);

            // yapılandırıcıyı kuruyoruz
            // AddEnvironmentVariables() ile .env'den yüklenen değerler de okunur
            var configuration = new ConfigurationBuilder()
                .SetBasePath(webApiPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("PostgreSQLConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    $"Connection string 'PostgreSQLConnection' boş veya bulunamadı. " +
                    $"WebAPI yolu: {webApiPath}, " +
                    $".env mevcut: {File.Exists(Path.Combine(webApiPath, ".env"))}");
            }

            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }

        /// <summary>
        /// Solution kökünü (.slnx / .sln dosyasının olduğu klasör) bulur.
        /// Birden fazla strateji dener: BaseDirectory'den yukarı tırmanma,
        /// CurrentDirectory'den yukarı tırmanma, ve Infrastructure klasöründen parent.
        /// </summary>
        private static string FindSolutionRoot()
        {
            // Strateji 1: AppDomain.CurrentDomain.BaseDirectory'den yukarı tırman
            var root = SearchUpForSolution(AppDomain.CurrentDomain.BaseDirectory);
            if (root != null) return root;

            // Strateji 2: Directory.GetCurrentDirectory()'den yukarı tırman
            root = SearchUpForSolution(Directory.GetCurrentDirectory());
            if (root != null) return root;

            // Strateji 3: Bu dosyanın bulunduğu Infrastructure klasöründen parent al
            // Infrastructure.dll -> bin/Debug/net10.0/ -> Infrastructure/ -> SolutionRoot/
            var assemblyLocation = typeof(DbContextFactory).Assembly.Location;
            if (!string.IsNullOrEmpty(assemblyLocation))
            {
                root = SearchUpForSolution(Path.GetDirectoryName(assemblyLocation)!);
                if (root != null) return root;
            }

            throw new InvalidOperationException(
                "Solution kökü bulunamadı. " +
                $"BaseDirectory: {AppDomain.CurrentDomain.BaseDirectory}, " +
                $"CurrentDirectory: {Directory.GetCurrentDirectory()}");
        }

        /// <summary>
        /// Verilen dizinden yukarı doğru tırmanarak .slnx veya .sln dosyası arar.
        /// </summary>
        private static string? SearchUpForSolution(string startPath)
        {
            var dir = new DirectoryInfo(startPath);
            while (dir != null)
            {
                if (dir.GetFiles("*.slnx").Any() || dir.GetFiles("*.sln").Any())
                {
                    return dir.FullName;
                }
                dir = dir.Parent;
            }
            return null;
        }

        /// <summary>
        /// .env dosyasını bulup environment variable olarak yükler.
        /// dotenv.net paketi Infrastructure projesinde olmayabileceği için manuel parse eder.
        /// </summary>
        private static void LoadEnvFile(string directory)
        {
            var envFilePath = Path.Combine(directory, ".env");
            if (!File.Exists(envFilePath)) return;

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