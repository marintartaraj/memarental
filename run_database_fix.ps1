# Database Fix Runner for MEMA Rental
# This script helps you apply the database relationship fixes

Write-Host "🚗 MEMA Rental Database Fix Runner" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "This script will help you fix the database relationship issues." -ForegroundColor Yellow
Write-Host ""

# Check if the fix script exists
if (Test-Path "fix_database_relationships.sql") {
    Write-Host "✅ Found fix_database_relationships.sql" -ForegroundColor Green
} else {
    Write-Host "❌ fix_database_relationships.sql not found!" -ForegroundColor Red
    Write-Host "Please ensure the file exists in the current directory." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open your Supabase project dashboard" -ForegroundColor White
Write-Host "2. Go to the SQL Editor" -ForegroundColor White
Write-Host "3. Copy the contents of fix_database_relationships.sql" -ForegroundColor White
Write-Host "4. Paste and run the SQL script" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT WARNINGS:" -ForegroundColor Red
Write-Host "- This will DELETE ALL EXISTING DATA in bookings, profiles, and cars tables!" -ForegroundColor Red
Write-Host "- Make sure you have backups if you need to preserve any data!" -ForegroundColor Red
Write-Host "- Only run this if you're sure you want to reset the database!" -ForegroundColor Red
Write-Host ""

Write-Host "🔗 Supabase Dashboard URL:" -ForegroundColor Cyan
Write-Host "https://supabase.com/dashboard" -ForegroundColor White
Write-Host ""

Write-Host "📖 For detailed instructions, see DATABASE_FIX_README.md" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to open the SQL file
$openFile = Read-Host "Would you like to open the SQL file to copy its contents? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    try {
        Start-Process "fix_database_relationships.sql"
        Write-Host "✅ Opened fix_database_relationships.sql" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not open the file automatically. Please open it manually." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 After running the SQL script:" -ForegroundColor Cyan
Write-Host "- Your admin bookings page should work without errors" -ForegroundColor White
Write-Host "- The foreign key relationships will be properly established" -ForegroundColor White
Write-Host "- Sample car data will be available" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
