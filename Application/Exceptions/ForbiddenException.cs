namespace SirenStore.Application.Exceptions
{
    /// <summary>
    /// Thrown when the current user is authenticated but does not have permission to perform the operation.
    /// Mapped to HTTP 403 Forbidden by the global exception handler.
    /// </summary>
    public class ForbiddenException : Exception
    {
        public ForbiddenException(string message) : base(message) { }
    }
}
