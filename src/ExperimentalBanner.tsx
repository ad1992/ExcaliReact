import React from "react";

export const ExperimentalBanner: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 text-gray-700 py-4 px-4 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-1">
        <span className="animate-pulse text-l">🧪</span>
        <span>
          This is an <strong>experimental prototype</strong> - Desktop
          recommended. Found a bug or have feedback? Please submit them on
        </span>
        <a
          href="https://github.com/ad1992/ExcaliReact/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-500"
        >
          GitHub.
        </a>
      </div>
    </div>
  );
};
