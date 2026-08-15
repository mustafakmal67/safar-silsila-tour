Add-Type -AssemblyName System.Drawing

$imagesDir = "d:\websites client\safar silsila travel agency\transport images"
$targetWidth = 800

if (-not (Test-Path $imagesDir)) {
    Write-Host "Error: Transport images folder not found at $imagesDir" -ForegroundColor Red
    Exit
}

$files = Get-ChildItem -Path $imagesDir -Filter "*.jpeg"
if ($files.Count -eq 0) {
    Write-Host "No .jpeg files found in $imagesDir" -ForegroundColor Yellow
    Exit
}

Write-Host "Optimizing $($files.Count) images..." -ForegroundColor Green

foreach ($file in $files) {
    $srcPath = $file.FullName
    $oldSize = $file.Length
    
    try {
        # Load the image
        $img = [System.Drawing.Image]::FromFile($srcPath)
        
        $width = $img.Width
        $height = $img.Height
        
        # Calculate new dimensions (max width 800px)
        if ($width -gt $targetWidth) {
            $ratio = $targetWidth / $width
            $newWidth = $targetWidth
            $newHeight = [int]($height * $ratio)
        } else {
            $newWidth = $width
            $newHeight = $height
        }
        
        # Create resized bitmap
        $bitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($bitmap)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        # Setup JPEG Compression encoder at 70% quality
        $imageCodecInfo = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoder = [System.Drawing.Imaging.Encoder]::Quality
        $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 70)
        
        # Release source file handle so we can replace it
        $img.Dispose()
        $g.Dispose()
        
        # Save to temp file and replace original
        $tempPath = $srcPath + ".tmp"
        $bitmap.Save($tempPath, $imageCodecInfo, $encoderParameters)
        $bitmap.Dispose()
        
        Remove-Item $srcPath -Force
        Rename-Item $tempPath -NewName $file.Name
        
        # Get new size
        $newSize = (Get-Item $srcPath).Length
        $oldSizeKb = ($oldSize / 1024).ToString("F1")
        $newSizeKb = ($newSize / 1024).ToString("F1")
        
        Write-Host "Optimized $($file.Name): ${oldSizeKb} KB -> ${newSizeKb} KB" -ForegroundColor Cyan
    }
    catch {
        Write-Host "Failed to process $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "`nAll images successfully optimized!" -ForegroundColor Green
