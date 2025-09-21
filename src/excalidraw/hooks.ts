import { useContext } from "react";
import { ExcalidrawContext } from "./ExcalidrawContext";

export const useExcalidraw = () => {
  return useContext(ExcalidrawContext);
};
