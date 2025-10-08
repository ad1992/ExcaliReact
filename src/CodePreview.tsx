import { useExcalidrawElementsToJSX } from "./parser/hooks";

export const CodePreview = () => {
  const { jsx, error } = useExcalidrawElementsToJSX();

  if (error) {
    return <div className="text-red-500 align-center">{error}</div>;
  }

  return jsx;
};
