using System.Linq.Expressions;
using Entities.Models;

namespace SirenStore.Application.Interfaces
{
    /// <summary>
    /// Tüm entity'ler için ortak CRUD operasyonlarını tanımlayan generic repository arayüzü.
    /// BaseModel'den türeyen her entity bu arayüzü kullanabilir.
    /// </summary>
    public interface IRepository<T> where T : BaseModel
    {
        Task<T?> GetByIdAsync(long id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
        Task<int> SaveChangesAsync();
    }
}
