using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace SirenStore.WebAPI.Middleware
{
    /// <summary>
    /// otomatik olarak yakalanmamış istisnaları günlüğe kaydetmek için bir ara katman
    /// </summary>
    public class ExceptionLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionLoggingMiddleware> _logger;

        public ExceptionLoggingMiddleware(RequestDelegate next, ILogger<ExceptionLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception caught by middleware");

                // veritabanına kaydetmek için ExceptionLog nesnesi oluştur
                try
                {
                    var dbContext = serviceProvider.GetRequiredService<DbContext>();

                    var exceptionLog = new ExceptionLog
                    {
                        ExceptionType = ex.GetType().FullName!,
                        Message = ex.Message,
                        StackTrace = ex.StackTrace,
                        RequestPath = context.Request.Path,
                        RequestMethod = context.Request.Method,
                        QueryString = context.Request.QueryString.ToString(),
                        Source = ex.Source
                    };

                    await dbContext.Set<ExceptionLog>().AddAsync(exceptionLog);
                    await dbContext.SaveChangesAsync();
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Failed to log exception to database");
                }

                throw;
            }
        }
    }
}
