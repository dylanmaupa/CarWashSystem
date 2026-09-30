$content = Get-Content -Path 'src\pages\customer\BookingConfirmation.tsx' -Raw
$marker = "`r`n`r`nimport { format } from 'date-fns';"
$cutIdx = $content.IndexOf($marker)
if ($cutIdx -gt 0) {
    $trimmed = $content.Substring(0, $cutIdx)
    Set-Content -Path 'src\pages\customer\BookingConfirmation.tsx' -Value $trimmed -NoNewline
    Write-Host "Trimmed successfully at index $cutIdx"
} else {
    Write-Host "Pattern not found"
}
