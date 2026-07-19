export function downloadAsPdf(content: string, filename: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; padding: 40px; line-height: 1.6; font-size: 12pt; }
        pre { white-space: pre-wrap; font-family: inherit; margin: 0; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
