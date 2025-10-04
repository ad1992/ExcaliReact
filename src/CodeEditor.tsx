import { Editor } from "@monaco-editor/react";
import { useExcalidraw } from "./excalidraw-wrapper/hooks";
import { useExcalidrawToJSXString } from "./parser/hooks";
import * as monaco from "monaco-editor";
import { CopyIcon } from "./assets/Icons";
export const CodeEditor = () => {
  const { excalidrawAPI } = useExcalidraw();

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) => {
    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: true,
    });

    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monacoInstance.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      jsxFragmentFactory: "React.Fragment",
      jsxImportSource: "react",
      allowJs: true,
      target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
    });
    monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' { export = React; export as namespace React; }`,
      "file:///node_modules/@types/react/index.d.ts"
    );
  };
  const jsxCode = useExcalidrawToJSXString();

  if (!excalidrawAPI) return null;

  return (
    <div className="relative h-full">
      <Editor
        language="typescript"
        value={jsxCode}
        height="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          wordWrapColumn: 80,
          readOnly: true,
          readOnlyMessage: {
            value:
              "The code is generated from your Excalidraw diagram and is read-only",
          },
        }}
        loading={<div>Loading...</div>}
      />
      <button
        className="absolute top-0 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 shadow-2xl border border-gray-700 z-10"
        title="Copy Code to Clipboard"
      >
        <CopyIcon />
      </button>
    </div>
  );
};
