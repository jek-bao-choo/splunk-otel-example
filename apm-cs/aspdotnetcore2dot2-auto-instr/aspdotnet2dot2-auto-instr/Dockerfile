#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
# https://stackoverflow.com/questions/57975211/cannot-find-latest-dotnet-core-images-on-docker-2-2-7

FROM mcr.microsoft.com/dotnet/core/aspnet:2.2.8 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2.207 AS build
WORKDIR /src
COPY ["aspdotnet2dot2-auto-instr.csproj", "."]
RUN dotnet restore "./aspdotnet2dot2-auto-instr.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "aspdotnet2dot2-auto-instr.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "aspdotnet2dot2-auto-instr.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY signalfx-dotnet-tracing* .
RUN dpkg -i signalfx-dotnet-tracing_0.1.15_amd64.deb
RUN mkdir /opt/tracelogs
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "aspdotnet2dot2-auto-instr.dll"]
