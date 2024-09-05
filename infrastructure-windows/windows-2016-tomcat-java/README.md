Work in progress.... The Javaagent didn't get attached to the Java app on Tomcat service.

1. Install Java Development Kit (JDK):
```powershell
# Set variables
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Test connection
if (-not (Test-NetConnection -ComputerName www.github.com -InformationLevel Quiet)) {
    Write-Host "Unable to connect to GitHub. Please check your internet connection."
    exit 1
}

$jdkUrl = "https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.19%2B7/OpenJDK11U-jdk_x64_windows_hotspot_11.0.19_7.msi"
$downloadPath = "C:\Temp\OpenJDK11.msi"

# Create temp directory
New-Item -ItemType Directory -Force -Path C:\Temp | Out-Null

# Download JDK
try {
    Invoke-WebRequest -Uri $jdkUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "MSI file downloaded successfully"
} catch {
    Write-Host "Download failed: $_"
    exit 1
}

# Install JDK
$process = Start-Process -FilePath msiexec -ArgumentList "/i `"$downloadPath`" /qn /L*v C:\Temp\jdk_install_log.txt" -Wait -PassThru -Verb RunAs
if ($process.ExitCode -eq 0) {
    Write-Host "Installation successful"
} else {
    Write-Host "Installation failed with exit code: $($process.ExitCode)"
    Get-Content C:\Temp\jdk_install_log.txt | Select-Object -Last 20
    exit 1
}

# Set JAVA_HOME environment variable
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-11.0.19.7-hotspot"
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Machine")

# Add Java to PATH
$path = [Environment]::GetEnvironmentVariable("Path", "Machine")
$newPath = "$javaHome\bin;" + $path
[Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

# Refresh environment variables in current session
$env:JAVA_HOME = [System.Environment]::GetEnvironmentVariable("JAVA_HOME", "Machine")
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

# Verify installation
Write-Host "Verifying Java installation..."
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java version:"
    Write-Host $javaVersion
    
    $javacVersion = javac -version 2>&1
    Write-Host "Javac version:"
    Write-Host $javacVersion
} catch {
    Write-Host "Error verifying Java installation: $_"
}

# Check for Java processes
Write-Host "Checking for Java processes..."
$javaProcesses = Get-WmiObject Win32_Process | Where-Object { $_.Name -like "java*" }
if ($javaProcesses) {
    Write-Host "Java processes found:"
    $javaProcesses | ForEach-Object { Write-Host "  $($_.Name) (PID: $($_.ProcessId))" }
} else {
    Write-Host "No Java processes currently running. This is normal if no Java applications are active."
}

# Final verification
if (Test-Path $javaHome) {
    Write-Host "Java installation verified successfully."
} else {
    Write-Host "Java installation directory not found. Please check the installation."
}

Write-Host "Java installation and setup completed successfully."
```

2. Install Apache Tomcat:
```powershell

# Set TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Variables
$tomcatVersion = "10.1.28"
$downloadUrl = "https://dlcdn.apache.org/tomcat/tomcat-10/v$tomcatVersion/bin/apache-tomcat-$tomcatVersion-windows-x64.zip"
$downloadPath = "C:\Temp\apache-tomcat-$tomcatVersion.zip"
$extractPath = "C:\Tomcat"

# Create temp directory if it doesn't exist
New-Item -ItemType Directory -Force -Path C:\Temp

# Download Tomcat
Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing

if (Test-Path $downloadPath) {
    Write-Host "Tomcat file downloaded successfully"
} else {
    Write-Host "Download failed"
}

# Extract Tomcat
Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force

# Rename extracted folder
Rename-Item -Path "$extractPath\apache-tomcat-$tomcatVersion" -NewName "tomcat10"

# Set CATALINA_HOME environment variable
[Environment]::SetEnvironmentVariable("CATALINA_HOME", "$extractPath\tomcat10", "Machine")

# Add Tomcat bin to PATH
$path = [Environment]::GetEnvironmentVariable("Path", "Machine")
$newPath = "$extractPath\tomcat10\bin;" + $path
[Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

# Create Tomcat service
$tomcatBin = "$extractPath\tomcat10\bin"
Set-Location $tomcatBin
.\service.bat install

# Start Tomcat service
Start-Service -Name "Tomcat10"

# Set the path to your Tomcat installation
$tomcatPath = "C:\Tomcat\tomcat10"

# Set CATALINA_HOME environment variable
[Environment]::SetEnvironmentVariable("CATALINA_HOME", $tomcatPath, "Machine")

# Refresh environment variables in the current session
$env:CATALINA_HOME = [System.Environment]::GetEnvironmentVariable("CATALINA_HOME", "Machine")

# Verify CATALINA_HOME
Write-Host "CATALINA_HOME is set to: $env:CATALINA_HOME"

# Check if the path exists
if (Test-Path $env:CATALINA_HOME) {
    Write-Host "The CATALINA_HOME path exists."
} else {
    Write-Host "Warning: The CATALINA_HOME path does not exist. Please check your Tomcat installation path."
}

# List contents of CATALINA_HOME to further verify
Write-Host "Contents of CATALINA_HOME:"
Get-ChildItem $env:CATALINA_HOME | Select-Object Name

# Output status
Write-Host "Tomcat has been installed and started. CATALINA_HOME is set to: $env:CATALINA_HOME"
Write-Host "Tomcat service status:"
Get-Service -Name "Tomcat10" | Select-Object Name, Status, StartType

Get-Service -Name "Tomcat10"

```

If Tomcat is not a service:

To stop: Run `C:\Tomcat\tomcat10\bin\shutdown.bat`
To start: Run `C:\Tomcat\tomcat10\startup.bat`
To check status:

try accessing http://localhost:8080 in a web browser

![](proof1.png)

---

Deploy your Java application:

Place the MyWebApp.war file in the `C:\Tomcat\tomcat10\webapps` directory

```Powershell

# Set TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Define the URL and destination path
$url = "https://github.com/jek-bao-choo/splunk-otel-example/raw/main/infrastructure-windows/windows-2016-tomcat-java/MyWebApp.war"
$destination = "C:\Tomcat\tomcat10\webapps\MyWebApp.war"

# Create the destination directory if it doesn't exist
New-Item -ItemType Directory -Force -Path (Split-Path -Path $destination)

# Download the file
try {
    Invoke-WebRequest -Uri $url -OutFile $destination
    Write-Output "File downloaded successfully to $destination"
} catch {
    Write-Error "Failed to download file: $_"
}

# Verify the file exists
if (Test-Path $destination) {
    Write-Output "Verified: MyWebApp.war exists in C:\Tomcat\tomcat10\webapps"
} else {
    Write-Error "Verification failed: MyWebApp.war not found in C:\Tomcat\tomcat10\webapps"
}

```

Verify the WAR is working correctly:

Open a web browser and go to http://localhost:8080/MyWebApp

Optionally restart Tomcat and check Tomcat status if it didn't work:

```powershell

Restart-Service -Name "Tomcat10"

Get-Service -Name "Tomcat10"

```

---

Add splunk-otel-javaagent.jar to the Java app.

```powershell

# Set TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Define the URL and destination path for the Splunk OTel Java agent
$agentUrl = "https://github.com/signalfx/splunk-otel-java/releases/latest/download/splunk-otel-javaagent.jar"
$agentDestination = "C:\Tomcat\splunk-otel-javaagent.jar"

# Download the agent
try {
    Invoke-WebRequest -Uri $agentUrl -OutFile $agentDestination
    Write-Output "Splunk OpenTelemetry Java agent downloaded successfully to $agentDestination"
} catch {
    Write-Error "Failed to download Splunk OpenTelemetry Java agent: $_"
}

# Verify the file exists
if (Test-Path $agentDestination) {
    Write-Output "Verified: splunk-otel-javaagent.jar exists in C:\Tomcat\"
} else {
    Write-Error "Verification failed: splunk-otel-javaagent.jar not found in C:\Tomcat\"
}

# Path to catalina.bat
$catalinaPath = "C:\Tomcat\tomcat10\bin\catalina.bat"

# Backup the original file
Copy-Item -Path $catalinaPath -Destination "$catalinaPath.bak"

# Read the content of catalina.bat
$content = Get-Content -Path $catalinaPath

# Prepare the Java agent configuration
$javaAgentConfig = @"
set CATALINA_OPTS=%CATALINA_OPTS% -javaagent:C:\Tomcat\splunk-otel-javaagent.jar -Dotel.exporter.otlp.endpoint=http://localhost:4318 -Dotel.resource.attributes=deployment.environment=jek-sandbox -Dotel.service.name=jek-windows-2016-tomcat-java -Dsplunk.metrics.endpoint=http://localhost:4318
"@

# Find the line containing "rem Ensure that any user defined CLASSPATH variables are not used"
$insertIndex = $content | Select-String -Pattern "rem Ensure that any user defined CLASSPATH variables are not used" | Select-Object -ExpandProperty LineNumber

if ($insertIndex) {
    # Insert the Java agent configuration before this line
    $newContent = $content[0..($insertIndex-2)] + $javaAgentConfig + $content[($insertIndex-1)..($content.Length-1)]
    
    # Write the modified content back to catalina.bat
    $newContent | Set-Content -Path $catalinaPath

    Write-Output "Successfully modified $catalinaPath to include Splunk OpenTelemetry Java agent"
} else {
    Write-Error "Could not find the appropriate location to insert Java agent configuration in $catalinaPath"
}

```

Check that it is written

```powershell
# Path to catalina.bat
$catalinaPath = "C:\Tomcat\tomcat10\bin\catalina.bat"

# Define the line we expect to find
$expectedLine = 'set CATALINA_OPTS=%CATALINA_OPTS% -javaagent:C:\Tomcat\splunk-otel-javaagent.jar -Dotel.exporter.otlp.endpoint=http://localhost:4318 -Dotel.resource.attributes=deployment.environment=jek-sandbox -Dotel.service.name=jek-windows-2016-tomcat-java -Dsplunk.metrics.endpoint=http://localhost:4318'

# Read the content of catalina.bat
$content = Get-Content -Path $catalinaPath

# Check for the expected line
if ($content -match [regex]::Escape($expectedLine)) {
    Write-Output "Verification successful: Java agent configuration found in $catalinaPath"
} else {
    Write-Output "Verification failed: Java agent configuration not found in $catalinaPath"
}

```

Verify the WAR is working correctly:

Open a web browser and go to http://localhost:8080/MyWebApp

Optionally restart Tomcat and check Tomcat status if it didn't work:

```powershell

# Restart Tomcat service
Restart-Service -Name Tomcat10

# Wait for the service to start
Start-Sleep -Seconds 30

Get-Service -Name Tomcat10

```


```powershell

function Get-JavaVersion {
    try {
        $javaOutput = & java -version 2>&1
        $versionInfo = $javaOutput -join "`n"
        return $versionInfo
    } catch {
        return "Error: $_"
    }
}

$javaVersion = Get-JavaVersion

if ($javaVersion -match "version") {
    Write-Output "Java is installed. Version information:"
    Write-Output $javaVersion
} else {
    Write-Output "Java is not found or there was an error: $javaVersion"
}

# Check JAVA_HOME environment variable
$javaHome = [Environment]::GetEnvironmentVariable("JAVA_HOME", "Machine")
if ($javaHome) {
    Write-Output "`nJAVA_HOME is set to: $javaHome"
    if (Test-Path $javaHome) {
        Write-Output "The JAVA_HOME path exists."
    } else {
        Write-Output "Warning: The JAVA_HOME path does not exist."
    }
} else {
    Write-Output "`nJAVA_HOME is not set."
}

# Check if Java is in the system PATH
$javaInPath = $env:Path -split ';' | Where-Object { $_ -like '*\Java\*' }
if ($javaInPath) {
    Write-Output "`nJava directories in PATH:"
    $javaInPath | ForEach-Object { Write-Output "  $_" }
} else {
    Write-Output "`nNo Java directories found in the system PATH."
}

```



```powershell
Stop-Service splunk-otel-collector
Start-Service splunk-otel-collector
Get-Service splunk-otel-collector
Get-Service splunk-otel-collector | Select-Object Name, Status, StartType, DisplayName
Get-Process -Name *otel*
```