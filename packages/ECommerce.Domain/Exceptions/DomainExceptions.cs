namespace ECommerce.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

public class InsufficientStockException : DomainException
{
    public InsufficientStockException(string productName, int requested, int available)
        : base($"Cannot fulfill request for {requested} units of '{productName}'. Only {available} available in stock.") { }
}

public class InvalidOrderOperationException : DomainException
{
    public InvalidOrderOperationException(string message) : base(message) { }
}

public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, object id)
        : base($"Entity '{entityName}' with ID '{id}' was not found.") { }
}
