Check if it's admin
`[Security.Principal.WindowsIdentity]::GetCurrent().Groups -contains 'S-1-5-32-544'`
This will return True if you're running as admin, and False if not.

Check the version of PowerShell
`$PSVersionTable`

1. Run this script if the function provided by Splunk didn't work:
```Powershell
function Get-ScriptContent {
    param($Uri)
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        return Invoke-RestMethod -Uri $Uri -UseBasicParsing
    }
    catch {
        Write-Host "Error downloading script: $_"
        return $null
    }
}
```

2. Now, let's modify your original command to use this function:
```Powershell
& {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    $scriptContent = Get-ScriptContent -Uri 'https://dl.signalfx.com/splunk-otel-collector.ps1'
    if ($null -eq $scriptContent) {
        Write-Host "Failed to download the script. Please check your internet connection and try again."
        return
    }
    $params = @{
        access_token = "< your access token >"
        realm = "us1"
        mode = "agent"
        with_dotnet_instrumentation = 0
    }
    $scriptBlock = [Scriptblock]::Create($scriptContent)
    & $scriptBlock @params
}
```



