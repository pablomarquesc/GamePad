# Dockerfile otimizado para Azure App Service
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443


# Fase de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GamePadAPI/GamePadAPI.csproj", "GamePadAPI/"]
RUN dotnet restore "GamePadAPI/GamePadAPI.csproj"
COPY . .
WORKDIR "/src/GamePadAPI"
RUN dotnet build "GamePadAPI.csproj" -c Release -o /app/build

# Fase de publish
FROM build AS publish
RUN dotnet publish "GamePadAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Fase final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GamePadAPI.dll"]