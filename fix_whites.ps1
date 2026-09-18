Get-ChildItem -Path "src/pages/manager" -Filter "*.tsx" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $updated = $content.Replace("background: 'white'", "background: 'var(--color-surface)'")
    Set-Content -Path $_.FullName -Value $updated -NoNewline
}
Write-Host "Done"
