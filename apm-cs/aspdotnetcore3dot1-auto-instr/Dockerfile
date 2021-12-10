FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["aspdotnetcore3dot1-auto-instr.csproj", "."]
RUN dotnet restore "./aspdotnetcore3dot1-auto-instr.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "aspdotnetcore3dot1-auto-instr.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "aspdotnetcore3dot1-auto-instr.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY signalfx-dotnet-tracing* .
RUN dpkg -i signalfx-dotnet-tracing_0.1.15_amd64.deb
RUN mkdir /opt/tracelogs
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "aspdotnetcore3dot1-auto-instr.dll"]
