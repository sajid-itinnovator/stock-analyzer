# Build and Export Docker Images for Distribution

$distDir = "StockResearch_Docker_Dist"
$imagesDir = "$distDir/images"
$errorActionPreference = "Stop"

Write-Host "Preparing Docker Distribution in '$distDir'..."

# Check Docker Status
try {
    docker info > $null
    Write-Host "Docker is running." -ForegroundColor Green
}
catch {
    Write-Error "Docker is NOT running. Please start Docker Desktop and try again."
    exit 1
}

# 1. Create Directories
if (Test-Path $distDir) { Remove-Item $distDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null

# 2. Build Images
Write-Host "Building WebApp Image (Frontend + Node)..."
docker build -f docker_source/Dockerfile.webapp -t stock-webapp:latest .
if ($LASTEXITCODE -ne 0) { Write-Error "WebApp Build Failed"; exit 1 }

Write-Host "Building Agent Image (Python)..."
docker build -f docker_source/Dockerfile.agent -t stock-agent:latest .
if ($LASTEXITCODE -ne 0) { Write-Error "Agent Build Failed"; exit 1 }

# 3. Save Images to Tar
Write-Host "Exporting WebApp Image to tar (this may take a moment)..."
docker save -o "$imagesDir/stock-webapp.tar" stock-webapp:latest
if ($LASTEXITCODE -ne 0) { Write-Error "WebApp Export Failed"; exit 1 }

Write-Host "Exporting Agent Image to tar..."
docker save -o "$imagesDir/stock-agent.tar" stock-agent:latest
if ($LASTEXITCODE -ne 0) { Write-Error "Agent Export Failed"; exit 1 }

# 4. Copy Configurations and Scripts
Write-Host "Copying configuration files..."
Copy-Item "docker_source/docker-compose-dist.yml" "$distDir/docker-compose.yml"
Copy-Item "README_DOCKER_DIST.md" "$distDir/README.md"
# Create an empty credentials template if needed, though env vars are preferred in docker
# We can copy the Credentials template just for reference
Copy-Item "backend-node/credentials_template.json" "$distDir/credentials_template.json"

# 5. Create the User Startup Script
$startScript = @"
`$ErrorActionPreference = 'Stop'

if (-not (Test-Path "images/stock-webapp.tar") -or -not (Test-Path "images/stock-agent.tar")) {
    Write-Host "ERROR: Docker images not found in 'images/' folder." -ForegroundColor Red
    Write-Host "Please ensure you have unzipped the entire package correctly."
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

Write-Host "Loading Docker Images... Please wait."
try {
    docker load -i images/stock-webapp.tar
    docker load -i images/stock-agent.tar
} catch {
    Write-Host "ERROR: Failed to load Docker images. Is Docker Desktop running?" -ForegroundColor Red
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

Write-Host "Starting Application..."
docker-compose up -d

Write-Host "App started! Open http://localhost:5000"
Read-Host -Prompt "Press Enter to close"
"@
Set-Content -Path "$distDir/install_and_run.ps1" -Value $startScript

Write-Host "Distribution Package Created Successfully at '$distDir'!"
