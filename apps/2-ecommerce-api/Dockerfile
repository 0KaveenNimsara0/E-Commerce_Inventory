FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Directory.Build.props", "./"]
COPY ["Directory.Packages.props", "./"]
COPY ["apps/2-ecommerce-api/ECommerce.Api.csproj", "apps/2-ecommerce-api/"]
COPY ["packages/ECommerce.Domain/ECommerce.Domain.csproj", "packages/ECommerce.Domain/"]
COPY ["packages/ECommerce.Application/ECommerce.Application.csproj", "packages/ECommerce.Application/"]
COPY ["packages/ECommerce.Infrastructure/ECommerce.Infrastructure.csproj", "packages/ECommerce.Infrastructure/"]
RUN dotnet restore "apps/2-ecommerce-api/ECommerce.Api.csproj"
COPY . .
WORKDIR "/src/apps/2-ecommerce-api"
RUN dotnet build "ECommerce.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ECommerce.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ECommerce.Api.dll"]
