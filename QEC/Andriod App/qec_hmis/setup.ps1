# QEC HMIS - Android App Setup Script
# Run this script to initialize the Flutter project

$ErrorActionPreference = "Stop"

Write-Host "=== QEC HMIS Android App Setup ===" -ForegroundColor Cyan

# Check if Flutter is installed
if (-not (Get-Command flutter -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Flutter SDK is not installed." -ForegroundColor Red
    Write-Host "Please install Flutter from: https://docs.flutter.dev/get-started/install/windows" -ForegroundColor Yellow
    exit 1
}

Write-Host "Flutter version: $(flutter --version | Select-Object -First 1)" -ForegroundColor Green

# Generate the Flutter project (run from parent directory)
Write-Host "`nCreating Flutter project..." -ForegroundColor Cyan
Set-Location -Path (Split-Path -Parent $PSScriptRoot)
flutter create --project-name qec_hmis --org com.qec qec_hmis_temp 2>$null

# Copy generated files to our project
if (Test-Path "qec_hmis_temp") {
    Copy-Item "qec_hmis_temp\android\*" "qec_hmis\android\" -Recurse -Force
    Copy-Item "qec_hmis_temp\ios\*" "qec_hmis\ios\" -Recurse -Force
    Copy-Item "qec_hmis_temp\web\*" "qec_hmis\web\" -Recurse -Force
    Copy-Item "qec_hmis_temp\test\*" "qec_hmis\test\" -Recurse -Force
    Remove-Item "qec_hmis_temp" -Recurse -Force
}

Set-Location -Path $PSScriptRoot

# Get dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
flutter pub get
if (-not $?) { Write-Host "Failed to get dependencies" -ForegroundColor Red; exit 1 }

# Generate code
Write-Host "`nGenerating code (JSON serialization, Riverpod, etc.)..." -ForegroundColor Cyan
dart run build_runner build --delete-conflicting-outputs
if (-not $?) { Write-Host "Code generation failed - this may be ok if models don't need regeneration" -ForegroundColor Yellow }

# Verify Firebase configuration
if (-not (Test-Path "lib/firebase_options.dart") -or (Select-String -Path "lib/firebase_options.dart" -Pattern "YOUR_API_KEY" -Quiet)) {
    Write-Host "`nNOTE: Firebase not configured." -ForegroundColor Yellow
    Write-Host "Run 'flutterfire configure' to set up Firebase, or edit lib/firebase_options.dart manually." -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "Run these commands to start:" -ForegroundColor Cyan
Write-Host "  cd $(Get-Location)" -ForegroundColor White
Write-Host "  flutter run" -ForegroundColor White
Write-Host "`nMake sure the backend API is running at the URL configured in lib/core/constants/api_constants.dart" -ForegroundColor Cyan
