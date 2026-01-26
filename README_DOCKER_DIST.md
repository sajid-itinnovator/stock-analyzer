# Stock Research Assistant - Docker Distribution

This package allows you to run the Stock Research Assistant on a secure, isolated Docker environment without needing to compile code.

## Prerequisites

- **Docker Desktop**: [Download Here](https://www.docker.com/products/docker-desktop)

## Installation & Startup

1.  **Unzip** the downloaded folder.
2.  Open the folder.
3.  Right-click **`install_and_run.ps1`** and select **Run with PowerShell**.
    *   *Note*: This script will load the application images into your local Docker registry and start the app.
    *   The first run might take a minute to load the files.

## Accessing the App

Open your browser to: **http://localhost:5000**

## Stopping the App

To stop the application, open a terminal in this folder and run:
```bash
docker-compose down
```

## Troubleshooting
- If the script doesn't run, open PowerShell in this folder and type: `./install_and_run.ps1`
