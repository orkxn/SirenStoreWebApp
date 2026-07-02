using System.Linq.Expressions;
using Entities.Models;

namespace SirenStore.Application.Interfaces
{
    /// <summary>
    /// tüm entityler için temel CRUD işlemlerini tanımlayan generic repository interface'i
    /// </summary>
    public interface IRepository<T> where T : BaseModel
    {
        Task<T?> GetByIdAsync(long id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        IQueryable<T> AsQueryable();
        void Update(T entity);
        void Remove(T entity);
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
        Task<int> SaveChangesAsync();
    }
}
