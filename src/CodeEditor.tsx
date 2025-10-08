import { Editor } from "@monaco-editor/react";
import { useExcalidraw } from "./excalidraw-wrapper/hooks";
import { useExcalidrawToJSXString } from "./parser/hooks";
import * as monaco from "monaco-editor";
import { CopyIcon } from "./assets/Icons";
import { useEffect, useState } from "react";

const AUTO_HIDE_TOAST_TIME = 3000;

export const CodeEditor = () => {
  const { excalidrawAPI } = useExcalidraw();

  const [toast, setToast] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

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
  const { jsxString, error } = useExcalidrawToJSXString();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(jsxString);
      setToast({
        type: "success",
        message: "Code copied to clipboard successfully",
      });
    } catch (err) {
      console.error("Failed to copy code to clipboard", err);
      setToast({
        type: "error",
        message: "Failed to copy code to clipboard",
      });
    }
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    setTimeout(() => {
      setToast({ type: null, message: "" });
    }, AUTO_HIDE_TOAST_TIME);
  }, [toast]);

  if (!excalidrawAPI) return null;
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="relative h-full w-full">
      <Editor
        language="typescript"
        value={jsxString}
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
        onClick={handleCopyCode}
      >
        <CopyIcon />
      </button>
      {toast.type && (
        <div
          className={`absolute top-10 right-4 text-white p-2 shadow-2xl border border-gray-700 z-10 ${toast.type === "success" ? "bg-green-700" : "bg-red-500"}`}
        >
          <div className="flex items-center gap-2">{toast.message}</div>
        </div>
      )}
    </div>
  );
};
