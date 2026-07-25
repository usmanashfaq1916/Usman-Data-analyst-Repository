# Generate PWA icon PNGs from SVG
# Requires: PowerShell 5.1+, .NET Framework 4.7+
# Usage: .\generate-icons.ps1

Add-Type -AssemblyName System.Drawing

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$svgPath = Join-Path $PSScriptRoot "icon.svg"
$svgContent = Get-Content $svgPath -Raw

# Create a bitmap and render the SVG using a simple approach
# For production, use a proper SVG-to-PNG converter
# This generates solid-color placeholder icons that match the theme
foreach ($size in $sizes) {
    $outputPath = Join-Path $PSScriptRoot "icon-$size.png"
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = "HighQuality"
    
    # Background
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0,0)),
        (New-Object System.Drawing.Point($size,$size)),
        [System.Drawing.Color]::FromArgb(255, 26, 92, 42),
        [System.Drawing.Color]::FromArgb(255, 14, 61, 25)
    )
    $g.FillRoundedRect($bgBrush, 0, 0, $size, $size, [Math]::Max(4, $size * 0.15))
    
    # Draw "QEC" text
    $fontSize = [Math]::Max(10, $size * 0.22)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = [System.Drawing.Brushes]::White
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = "Center"
    $format.LineAlignment = "Center"
    
    $g.DrawString("QEC", $font, $textBrush, (New-Object System.Drawing.RectangleF(0, $size * 0.55, $size, $size * 0.35)), $format)
    
    # Draw graduation cap (triangle)
    $capSize = $size * 0.25
    $capY = $size * 0.2
    $cap = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cap.AddPolygon(@(
        (New-Object System.Drawing.PointF($size/2, $capY - $capSize)),
        (New-Object System.Drawing.PointF($size/2 - $capSize * 1.5, $capY)),
        (New-Object System.Drawing.PointF($size/2 + $capSize * 1.5, $capY))
    ))
    $capBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 201, 162, 39))
    $g.FillPath($capBrush, $cap)
    
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    
    Write-Host "Generated $outputPath"
}

Write-Host "All icons generated successfully!"
