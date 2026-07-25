Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

foreach ($size in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0x1A, 0x5C, 0x2A))
  $g.FillRectangle($bgBrush, 0, 0, $size, $size)

  $fontSize = [Math]::Max(12, $size / 4)
  $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
  $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $text = "QEC"

  $textSize = $g.MeasureString($text, $font)
  $x = ($size - $textSize.Width) / 2
  $y = ($size - $textSize.Height) / 2
  $g.DrawString($text, $font, $textBrush, $x, $y)

  $path = Join-Path $scriptDir "icon-$size.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "Generated $path"
}

Write-Output "All icons generated successfully!"
