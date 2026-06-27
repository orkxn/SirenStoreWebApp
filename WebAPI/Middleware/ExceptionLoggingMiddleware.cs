using Entities.Models;
using SirenStore.Application.Interfaces;

namespace SirenStore.WebAPI.Middleware
{
    /// <summary>
    /// Middleware that automatically logs all exceptions to the ExceptionLog table
    /// Provides automatic error tracking and debugging capabilities
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

                // Log to database if repository is available
                try
                {
                    var exceptionLogRepository = serviceProvider.GetRequiredService<IRepository<ExceptionLog>>();

                    var exceptionLog = new ExceptionLog
                    {
                        ExceptionType = ex.GetType().FullName,
                        Message = ex.Message,
                        StackTrace = ex.StackTrace,
                        RequestPath = context.Request.Path,
                        RequestMethod = context.Request.Method,
                        QueryString = context.Request.QueryString.ToString(),
                        Source = ex.Source
                    };

                    await exceptionLogRepository.AddAsync(exceptionLog);
                    await exceptionLogRepository.SaveChangesAsync();
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
