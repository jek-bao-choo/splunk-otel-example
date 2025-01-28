# Pull the image
`docker pull mcr.microsoft.com/mssql/server:2022-latest`

# Run the container
`docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:14
33 --name sql2022 -d mcr.microsoft.com/mssql/server:2022-latest`

# Use MS SQL CLI to query for data
```
docker exec -it sql2022 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C
```

# Download sample data from AdventureWorks
```
docker exec -it sql2022 wget https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2019.bak -P /var/opt/mssql/backup/
```

# Restore the database
```
docker exec -it sql2022 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C -Q "
RESTORE DATABASE AdventureWorks2019
FROM DISK = '/var/opt/mssql/backup/AdventureWorks2019.bak'
WITH MOVE 'AdventureWorks2019' TO '/var/opt/mssql/data/AdventureWorks2019.mdf',
MOVE 'AdventureWorks2019_Log' TO '/var/opt/mssql/data/AdventureWorks2019_Log.ldf'
"
```

# Execute query
`docker exec -it sql2022 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C`

```
-- See available databases
SELECT name FROM sys.databases;
GO

-- Switch to AdventureWorks
USE AdventureWorks2019;
GO

-- See tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- Query some sample data
SELECT TOP 5 * FROM Person.Person;
GO

-- Get product information
SELECT TOP 10 * FROM Production.Product;
GO

-- Get sales information
SELECT TOP 10 *FROM Sales.SalesOrderHeader;
GO
```

# RANK(), DENSE_RANK(), and ROW_NUMBER()
```SQL
SELECT 
    FirstName,
    Salary,
    ROW_NUMBER() OVER (ORDER BY Salary DESC) as RowNum,
    RANK() OVER (ORDER BY Salary DESC) as RankNum,
    DENSE_RANK() OVER (ORDER BY Salary DESC) as DenseRankNum
FROM Employees;

/* 
Differences:
- ROW_NUMBER(): Always unique (1,2,3,4,...)
- RANK(): Leaves gaps (1,2,2,4,...)
- DENSE_RANK(): No gaps (1,2,2,3,...)
*/
```

# Partitioning with OVER
```SQL
-- Rank employees within each department
SELECT 
    DepartmentName,
    FirstName,
    Salary,
    RANK() OVER (PARTITION BY DepartmentName ORDER BY Salary DESC) as RankInDepartment
FROM Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

# Complex Example: Median Salary by Department
```SQL
WITH SalaryRanks AS (
    SELECT 
        DepartmentName,
        Salary,
        ROW_NUMBER() OVER (PARTITION BY DepartmentName ORDER BY Salary) as RowAsc,
        ROW_NUMBER() OVER (PARTITION BY DepartmentName ORDER BY Salary DESC) as RowDesc
    FROM Employees e
    JOIN Departments d ON e.DepartmentID = d.DepartmentID
)
SELECT DISTINCT 
    DepartmentName,
    AVG(Salary) OVER (PARTITION BY DepartmentName) as MedianSalary
FROM SalaryRanks
WHERE RowAsc IN (RowDesc, RowDesc - 1, RowDesc + 1);
```

# Finding Top N per Group
```
-- Find top 3 paid employees in each department
WITH RankedEmployees AS (
    SELECT 
        DepartmentName,
        FirstName,
        Salary,
        DENSE_RANK() OVER (PARTITION BY DepartmentName ORDER BY Salary DESC) as SalaryRank
    FROM Employees e
    JOIN Departments d ON e.DepartmentID = d.DepartmentID
)
SELECT * FROM RankedEmployees
WHERE SalaryRank <= 3;
```

# Running Totals and Moving Averages
```
SELECT 
    OrderDate,
    OrderAmount,
    SUM(OrderAmount) OVER (ORDER BY OrderDate) as RunningTotal,
    AVG(OrderAmount) OVER (
        ORDER BY OrderDate 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as MovingAverage3Days
FROM Orders;
```

# Islands and Gaps Problem
```
-- Find consecutive date ranges
WITH NumberedDates AS (
    SELECT 
        Date,
        ROW_NUMBER() OVER (ORDER BY Date) as RowNum,
        DATEADD(day, -ROW_NUMBER() OVER (ORDER BY Date), Date) as GroupStart
    FROM Dates
)
SELECT 
    MIN(Date) as RangeStart,
    MAX(Date) as RangeEnd,
    COUNT(*) as ConsecutiveDays
FROM NumberedDates
GROUP BY GroupStart
ORDER BY RangeStart;
```

# Percentile Functions
```
SELECT 
    DepartmentName,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Salary) OVER (PARTITION BY DepartmentName) as MedianSalary,
    PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY Salary) OVER (PARTITION BY DepartmentName) as DiscreteMedian
FROM Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

# AdventureWorks

## Rank Products by Price:
```
SELECT 
    Name,
    ListPrice,
    ROW_NUMBER() OVER (ORDER BY ListPrice DESC) as RowNum,
    RANK() OVER (ORDER BY ListPrice DESC) as RankNum,
    DENSE_RANK() OVER (ORDER BY ListPrice DESC) as DenseRankNum
FROM Production.Product
WHERE ListPrice > 0;
GO
```

## Top 3 Products by SubCategory:
```
WITH RankedProducts AS (
    SELECT 
        p.Name AS ProductName,
        ps.Name AS SubcategoryName,
        p.ListPrice,
        DENSE_RANK() OVER (PARTITION BY ps.ProductSubcategoryID ORDER BY p.ListPrice DESC) as PriceRank
    FROM Production.Product p
    JOIN Production.ProductSubcategory ps 
    ON p.ProductSubcategoryID = ps.ProductSubcategoryID
)
SELECT * FROM RankedProducts
WHERE PriceRank <= 3;
GO
```

## Sales Performance Ranking:
```
SELECT 
    p.FirstName,
    p.LastName,
    COUNT(soh.SalesOrderID) as TotalOrders,
    RANK() OVER (ORDER BY COUNT(soh.SalesOrderID) DESC) as SalesRank
FROM Person.Person p
JOIN Sales.SalesPerson sp ON p.BusinessEntityID = sp.BusinessEntityID
JOIN Sales.SalesOrderHeader soh ON sp.BusinessEntityID = soh.SalesPersonID
GROUP BY p.BusinessEntityID, p.FirstName, p.LastName;
GO
```

## Running Total of Sales by Month:
```
SELECT 
    DATEPART(year, OrderDate) as Year,
    DATEPART(month, OrderDate) as Month,
    SUM(TotalDue) as MonthlyTotal,
    SUM(SUM(TotalDue)) OVER (ORDER BY DATEPART(year, OrderDate), DATEPART(month, OrderDate)) as RunningTotal
FROM Sales.SalesOrderHeader
GROUP BY DATEPART(year, OrderDate), DATEPART(month, OrderDate);
GO
```

## Employee Salary Percentiles by Department:
```
SELECT 
    d.Name as DepartmentName,
    p.FirstName,
    p.LastName,
    e.JobTitle,
    eph.Rate as HourlyRate,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY eph.Rate) 
        OVER (PARTITION BY d.DepartmentID) as MedianDepartmentRate
FROM HumanResources.Employee e
JOIN Person.Person p ON e.BusinessEntityID = p.BusinessEntityID
JOIN HumanResources.EmployeePayHistory eph ON e.BusinessEntityID = eph.BusinessEntityID
JOIN HumanResources.EmployeeDepartmentHistory edh ON e.BusinessEntityID = edh.BusinessEntityID
JOIN HumanResources.Department d ON edh.DepartmentID = d.DepartmentID
WHERE edh.EndDate IS NULL;
GO
```

## Product Sales Moving Average:
```
WITH ProductSales AS (
    SELECT 
        p.ProductID,
        p.Name,
        DATEPART(month, soh.OrderDate) as SalesMonth,
        SUM(sod.OrderQty) as QuantitySold
    FROM Production.Product p
    JOIN Sales.SalesOrderDetail sod ON p.ProductID = sod.ProductID
    JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
    GROUP BY p.ProductID, p.Name, DATEPART(month, soh.OrderDate)
)
SELECT 
    ProductID,
    Name,
    SalesMonth,
    QuantitySold,
    AVG(QuantitySold * 1.0) OVER (
        PARTITION BY ProductID 
        ORDER BY SalesMonth
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as MovingAvg3Months
FROM ProductSales
ORDER BY ProductID, SalesMonth;
GO
```