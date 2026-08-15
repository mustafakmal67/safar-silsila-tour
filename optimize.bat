@echo off
echo Running Safar Silsila Image Optimizer (In-Memory PowerShell Bypass)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content optimize_images.ps1 | Out-String | Invoke-Expression"
pause
