import { useEffect, useRef } from 'react';

interface PreviewProps {
  html: string;
  css: string;
  js: string;
}

export const Preview = ({ html, css, js }: PreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const document = iframe.contentDocument || iframe.contentWindow?.document;
    if (!document) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            // Wrap user code in try-catch to prevent errors from breaking the preview
            try {
              ${js}
            } catch (error) {
              console.error('Error in user code:', error);
              document.body.innerHTML += '<div style="padding: 20px; background: #fee; border: 1px solid #faa; color: #c00; margin: 10px; border-radius: 4px;"><strong>JavaScript Error:</strong> ' + error.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;

    document.open();
    document.write(content);
    document.close();
  }, [html, css, js]);

  return (
    <div className="h-full bg-preview-bg">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};
