import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";

interface EditorProps {
  onCodeChange: (newValue: string) => void;
}

const TypstEditor: React.FC<EditorProps> = ({ onCodeChange }) => {
  useEffect(() => {
    onCodeChange("#lorem(1000)");
  }, []);

  return (
    <div>
      <CodeMirror
        value="#lorem(1000)"
        height="1200px"
        onChange={(value, viewUpdate) => {
          onCodeChange(value);
        }}
      />
    </div>
  );
}

export default TypstEditor;
