import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';

interface CodeEditorProps {
  language: 'html' | 'css' | 'javascript';
  value: string;
  onChange: (value: string) => void;
}

const getLanguageExtension = (language: string) => {
  switch (language) {
    case 'html':
      return html();
    case 'css':
      return css();
    case 'javascript':
      return javascript();
    default:
      return html();
  }
};

const getLanguageColor = (language: string) => {
  switch (language) {
    case 'html':
      return 'hsl(var(--code-html))';
    case 'css':
      return 'hsl(var(--code-css))';
    case 'javascript':
      return 'hsl(var(--code-js))';
    default:
      return 'hsl(var(--code-html))';
  }
};

export const CodeEditor = ({ language, value, onChange }: CodeEditorProps) => {
  const languageColor = getLanguageColor(language);
  
  return (
    <div className="flex flex-col h-full border-r border-border last:border-r-0">
      <div 
        className="px-4 py-2 text-sm font-medium border-b border-border"
        style={{ color: languageColor }}
      >
        {language.toUpperCase()}
      </div>
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          theme="dark"
          extensions={[getLanguageExtension(language), EditorView.lineWrapping]}
          onChange={onChange}
          className="h-full text-sm"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
};
