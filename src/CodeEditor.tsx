import { Editor } from "@monaco-editor/react";
import { useExcalidraw } from "./excalidraw/hooks";
import { convertExcalidrawToJSXString } from "./parser/convertExcalidrawToJSXString";

export const CodeEditor = () => {
  const { excalidrawAPI } = useExcalidraw();
  if (!excalidrawAPI) return null;
  const jsxCode = convertExcalidrawToJSXString(
    excalidrawAPI.getSceneElements()
  );

  return (
    <Editor
      language="jsx"
      value={jsxCode}
      height="100%"
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        wordWrapColumn: 80,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
};
