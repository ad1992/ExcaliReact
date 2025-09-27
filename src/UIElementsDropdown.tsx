import { useEffect, useRef, useState } from "react";

interface UIElements {
  label: string;
  value: string;
}

export enum UIElement {
  BUTTON = "button",
  INPUT = "input",
  LINK = "link",
}

const UIElements = [
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
        className="border border-gray-300 rounded-md p-2 ml-4"
        onClick={() => setShowUiElements(!showUiElements)}
      >
        UI Elements
      </button>
      {showUiElements && (
        <div className="absolute bottom-full left-0 mt-2 w-48 bg-white rounded-md shadow-sm bg-gray-50">
          {UIElements.map((uiElement) => (
            <button
              key={uiElement.value}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 text-gray-700"
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
