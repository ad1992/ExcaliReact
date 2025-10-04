import { useEffect, useRef, useState } from "react";
import { UIElement } from "./types";

interface UIElements {
  label: string;
  value: string;
}

const UIElements = [
  {
    label: "Frame",
    value: UIElement.FRAME,
  },

  {
    label: "Button",
    value: UIElement.BUTTON,
  },
  {
    label: "Input",
    value: UIElement.INPUT,
  },
  {
    label: "Link",
    value: UIElement.LINK,
  },
  {
    label: "Text",
    value: UIElement.TEXT,
  },
];

export const UIElementsDropdown = ({
  onSelect,
}: {
  onSelect: (uiElement: UIElement) => void;
}) => {
  const [showUiElements, setShowUiElements] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUiElements(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUiElementClick = (uiElement: UIElement) => {
    onSelect(uiElement);
    setShowUiElements(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="border border-gray-300 rounded-md p-2 ml-4 flex items-center justify-center h-9 bg-violet-100 hover:bg-violet-200 text-gray-700"
        onClick={() => setShowUiElements(!showUiElements)}
      >
        UI Elements
      </button>
      {showUiElements && (
        <div className="absolute bottom-full left-0 mt-2 w-48 bg-white rounded-md shadow-sm bg-gray-50">
          {UIElements.map((uiElement) => (
            <button
              key={uiElement.value}
              className="w-full text-left px-4 py-2 hover:bg-violet-200 text-gray-700"
              onClick={() => handleUiElementClick(uiElement.value)}
            >
              {uiElement.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
