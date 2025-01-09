# .NET Development Setup Guide

This guide provides comprehensive instructions for setting up a .NET development environment and creating API projects using different approaches.

## Prerequisites

### .NET SDK Installation

1. Download the .NET 6.0.428 SDK from https://dotnet.microsoft.com/en-us/download/dotnet/6.0

In the folder with global.json run `dotnet --version` to check that the version is 6.0.428.

 Minimal APIs

Minimal APIs provide a streamlined approach ideal for microservices and small applications. They offer a simplified architecture with reduced boilerplate code.

**Documentation:**
https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-6.0&tabs=visual-studio-code

1. `dotnet new web -o jek-dotnet6-minimalapi-web`

2. Navigate to the project directory:
   ```
   cd jek-dotnet6-minimalapi-web
   ```

3. Configure HTTPS certificate:
   ```
   dotnet dev-certs https --trust
   ```

4. Add NuGets
```
dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 6.0.28
dotnet add package Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore --version 6.0.28
```

5. Run the application:
   ```
   dotnet run
   ```

6. Another terminal to test it:
```
curl http://localhost:<the port number>
```

## Building the Application
In the folder of jek-dotnet6-minimalapi-web run
```
dotnet build
```

```
docker build -t jek-dotnet6-minimalapi-web:1.0 .
```

```
docker run -d -p 8080:80 --name jek-dotnet6-minimalapi-web-container jek-dotnet6-minimalapi-web:1.0
```

Test it
```
curl http://localhost:8080
```

## Push the Image to a Docker Registry
```
docker tag jek-dotnet6-minimalapi-web:1.0 jchoo/jek-dotnet6-minimalapi-web:1.0
```

```
docker push jchoo/jek-dotnet6-minimalapi-web:1.0
```

## Kubernetes Deployment

### Option 1: Semi-automated Deployment

Work in progress...

This approach uses a custom deployment configuration in a YAML file. You can use any Kubernetes cluster (local, EKS, AKS, GKE, etc.).

1. Install the Splunk OTel Collector Chart:
   https://github.com/signalfx/splunk-otel-collector-chart

2. Deploy the application:
   ```
   kubectl apply -f deployment-miniapi-with-agent.yaml
   ```

3. Set up port forwarding:
   ```
   kubectl port-forward deployment/jek-dotnet6-minimalapi-web 3009:80
   ```

4. Test the deployment:
   ```
   # Test general endpoint
   curl http://localhost:3009

   # View deployment logs
   kubectl logs deployment/jek-dotnet6-minimalapi-web
   ```

### Option 2: Automated Instrumentation with OTel Operator

Work in progress...