# Simple Database Fix Script for MEMA Rental
# This script runs the database fix SQL file

Write-Host "Starting database fix for MEMA Rental..." -ForegroundColor Green

# Check if the SQL file exists
if (Test-Path "fix_database_relationships.sql") {
    Write-Host "SQL file found. Please run this SQL in your Supabase SQL editor:" -ForegroundColor Yellow
    Write-Host "1. Go to your Supabase dashboard" -ForegroundColor Cyan
    Write-Host "2. Navigate to SQL Editor" -ForegroundColor Cyan
    Write-Host "3. Copy the contents of fix_database_relationships.sql" -ForegroundColor Cyan
    Write-Host "4. Paste and run the SQL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use the Supabase CLI if you have it installed:" -ForegroundColor Yellow
    Write-Host "supabase db reset --linked" -ForegroundColor Cyan
} else {
    Write-Host "Error: fix_database_relationships.sql not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
