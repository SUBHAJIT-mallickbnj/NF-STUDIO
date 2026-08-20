$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "dbnorm-backend"
$frontend = Join-Path $root "frontend"
$jar = Join-Path $backend "target\dbnorm-0.0.1-SNAPSHOT.jar"

function Test-PortListening {
    param([int]$Port)

    return $null -ne (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue)
}

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    throw "Java was not found on PATH. Install Java 21 or newer and run this script again."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm was not found on PATH. Install Node.js and run this script again."
}

$jarNeedsBuild = -not (Test-Path $jar)
if (-not $jarNeedsBuild) {
    $jarNeedsBuild = (Get-Item $jar).Length -lt 1MB
}
if (-not $jarNeedsBuild) {
    $newestBackendSource = Get-ChildItem $backend -Recurse -File -Include *.java, pom.xml, application.properties |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    $jarNeedsBuild = $null -ne $newestBackendSource -and $newestBackendSource.LastWriteTime -gt (Get-Item $jar).LastWriteTime
}

if ($jarNeedsBuild) {
    Write-Host "Backend JAR is missing or invalid. Building backend..." -ForegroundColor Yellow
    Push-Location $backend
    try {
        & .\mvnw.cmd clean package -DskipTests
    }
    finally {
        Pop-Location
    }
}

if (-not (Test-PortListening 8080)) {
    Start-Process powershell.exe -WorkingDirectory $backend -ArgumentList @(
        "-NoExit",
        "-Command",
        "java -jar `"$jar`""
    )
    Write-Host "Starting backend on http://localhost:8080 ..." -ForegroundColor Cyan
}
else {
    Write-Host "Backend already running on http://localhost:8080" -ForegroundColor Green
}

if (-not (Test-Path (Join-Path $frontend "node_modules"))) {
    Write-Host "Frontend dependencies not found. Installing npm packages..." -ForegroundColor Yellow
    Push-Location $frontend
    try {
        & npm install
    }
    finally {
        Pop-Location
    }
}

$frontendBuild = Join-Path $frontend "dist\index.html"
 $frontendNeedsBuild = -not (Test-Path $frontendBuild)
if (-not $frontendNeedsBuild) {
    $newestFrontendSource = Get-ChildItem $frontend\src, $frontend\public, (Join-Path $frontend "package.json"), (Join-Path $frontend "vite.config.js") -Recurse -File |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    $frontendNeedsBuild = $null -ne $newestFrontendSource -and $newestFrontendSource.LastWriteTime -gt (Get-Item $frontendBuild).LastWriteTime
}

if ($frontendNeedsBuild) {
    Write-Host "Frontend build not found. Building frontend..." -ForegroundColor Yellow
    Push-Location $frontend
    try {
        & npm run build
    }
    finally {
        Pop-Location
    }
}

if (-not (Test-PortListening 5173)) {
    Start-Process powershell.exe -WorkingDirectory $frontend -ArgumentList @(
        "-NoExit",
        "-Command",
        "npm run preview -- --host localhost --port 5173"
    )
    Write-Host "Starting frontend on http://localhost:5173 ..." -ForegroundColor Cyan
}
else {
    Write-Host "Frontend already running on http://localhost:5173" -ForegroundColor Green
}

for ($attempt = 1; $attempt -le 30; $attempt++) {
    if ((Test-PortListening 8080) -and (Test-PortListening 5173)) {
        Write-Host ""
        Write-Host "DB-Norm is running: http://localhost:5173" -ForegroundColor Green
        Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor Green
        exit 0
    }
    Start-Sleep -Seconds 1
}

throw "The services did not start within 30 seconds. Check the two server windows for the error."