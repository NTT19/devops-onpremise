FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG TARGETARCH
WORKDIR /src
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore -a $TARGETARCH "backend/backend.csproj"
COPY . .
WORKDIR "/src/backend"
RUN dotnet build "backend.csproj" -a $TARGETARCH -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backend.csproj" -a $TARGETARCH -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "backend.dll"]
