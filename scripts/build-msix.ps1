param(
    [string]$CertificateThumbprint = '',
    [switch]$SkipElectronPack
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
if (-not (Get-PSDrive -Name Cert -ErrorAction SilentlyContinue)) {
    if ($PSVersionTable.PSEdition -eq 'Desktop') {
        $env:PSModulePath = @(
            (Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\Modules'),
            (Join-Path $env:ProgramFiles 'WindowsPowerShell\Modules'),
            (Join-Path $env:USERPROFILE 'Documents\WindowsPowerShell\Modules')
        ) -join [System.IO.Path]::PathSeparator
    }
    Import-Module Microsoft.PowerShell.Security -ErrorAction Stop
    if (-not (Get-PSDrive -Name Cert -ErrorAction SilentlyContinue)) {
        New-PSDrive -Name Cert -PSProvider Certificate -Root '\' -Scope Global | Out-Null
    }
}
$repo = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $repo
$package = Get-Content -LiteralPath (Join-Path $repo 'package.json') -Raw | ConvertFrom-Json
$versionParts = @($package.version -split '\.')
if ($versionParts.Count -ne 3 -or @($versionParts | Where-Object { $_ -notmatch '^\d+$' -or [int]$_ -gt 65535 }).Count -gt 0) {
    throw 'package.json version must have three numeric components.'
}
$version = "$($package.version).0"
$expectedPublisher = 'CN=15A53D32-C868-48EE-B700-5DBB5449CA1B'
$sdk = 'C:\Program Files (x86)\Windows Kits\10\bin'
$makeAppx = Get-ChildItem -LiteralPath $sdk -Directory | Where-Object { $_.Name -match '^\d+(\.\d+){3}$' } | Sort-Object { [version]$_.Name } -Descending | ForEach-Object {
    Join-Path $_.FullName 'x64\makeappx.exe'
} | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$signTool = Join-Path (Split-Path -Parent (Split-Path -Parent $makeAppx)) 'x64\signtool.exe'
if (-not $makeAppx -or -not (Test-Path -LiteralPath $signTool)) { throw 'Windows SDK MakeAppx and SignTool are required.' }

$certs = @(Get-ChildItem Cert:\CurrentUser\My | Where-Object {
    $_.Subject -eq $expectedPublisher -and $_.HasPrivateKey -and $_.NotAfter -gt (Get-Date) -and
    ($_.EnhancedKeyUsageList.ObjectId -contains '1.3.6.1.5.5.7.3.3') -and
    (-not $CertificateThumbprint -or $_.Thumbprint -eq $CertificateThumbprint)
} | Sort-Object NotAfter -Descending)
if ($certs.Count -eq 0) { throw 'No installed code-signing certificate with the required publisher and private key was found.' }
$cert = $certs[0]

$unpacked = Join-Path $repo 'dist\win-unpacked'
if (-not $SkipElectronPack) {
    & npm.cmd run pack
    if ($LASTEXITCODE -ne 0) { throw 'Electron packaging failed.' }
}
if (-not (Test-Path -LiteralPath (Join-Path $unpacked 'MixDesk.exe'))) { throw 'Missing unpacked Electron application.' }

$stage = [System.IO.Path]::GetFullPath((Join-Path $repo 'dist\msix-stage'))
$output = [System.IO.Path]::GetFullPath((Join-Path $repo 'dist\msix'))
if (-not $stage.StartsWith($repo + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase) -or
    -not $output.StartsWith($repo + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'MSIX output must remain inside the workspace.'
}
if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage, $output -Force | Out-Null
& robocopy.exe $unpacked $stage /E /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw 'Could not stage Electron files.' }

$assets = Join-Path $stage 'Assets'
& python (Join-Path $repo 'scripts\msix_assets.py') $assets
if ($LASTEXITCODE -ne 0) { throw 'Could not generate MSIX visual assets. Install Pillow for the build environment.' }
$manifestTemplate = Get-Content -LiteralPath (Join-Path $repo 'packaging\AppxManifest.xml.in') -Raw
$manifest = $manifestTemplate.Replace('__VERSION__', $version)
$manifestPath = Join-Path $stage 'AppxManifest.xml'
[System.IO.File]::WriteAllText($manifestPath, $manifest, [System.Text.UTF8Encoding]::new($false))
[xml]$null = Get-Content -LiteralPath $manifestPath -Raw

$unsigned = Join-Path $output "MixDesk_${version}_x64_Store.msix"
$signed = Join-Path $output "MixDesk_${version}_x64_TestSigned.msix"
$makeAppxLog = Join-Path $output 'makeappx.log'
& $makeAppx pack /o /h SHA256 /d $stage /p $unsigned *> $makeAppxLog
if ($LASTEXITCODE -ne 0) { Get-Content -LiteralPath $makeAppxLog -Tail 25; throw 'MakeAppx failed.' }
Copy-Item -LiteralPath $unsigned -Destination $signed -Force
& $signTool sign /fd SHA256 /sha1 $cert.Thumbprint /s My /v $signed
if ($LASTEXITCODE -ne 0) { throw 'SignTool could not sign the test package.' }
& $signTool verify /pa /v $signed
if ($LASTEXITCODE -ne 0) { throw 'Signature verification failed.' }

$hashes = @($unsigned, $signed) | ForEach-Object {
    $hash = (Get-FileHash -LiteralPath $_ -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  $(Split-Path -Leaf $_)"
}
$hashes | Set-Content -LiteralPath (Join-Path $output 'SHA256SUMS.txt') -Encoding ascii
Remove-Item -LiteralPath $stage -Recurse -Force
Write-Output "Store MSIX: $unsigned"
Write-Output "Signed test MSIX: $signed"
Write-Output "Signing certificate: $($cert.Thumbprint)"
