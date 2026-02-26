# run-server.ps1
# Starts a simple HTTP server and opens the default browser.

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $root

Write-Host "Starting local HTTP server at http://localhost:8000/"

# Launch Python http.server if Python is available
if (Get-Command python -ErrorAction SilentlyContinue) {
    Start-Process python -ArgumentList "-m http.server 8000"
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    Start-Process npx -ArgumentList "http-server -p 8000"
} else {
    Write-Warning "Neither python nor npx was found. Please run a server manually (see README)."
}

# open browser
Start-Process "http://localhost:8000/"

Pop-Location
