import React, {
  useEffect,
  useRef,
  useState,
  FC,
  MouseEvent,
  RefObject,
} from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  RichUtils,
  DraftHandleValue,
} from "draft-js";
import "draft-js/dist/Draft.css";

// --------- Types ---------
interface TextEditorProps {
  editorState: EditorState;
  sendToParent: (data: string) => void;
}

interface StyleButtonProps {
  label: string;
  style: string;
  onToggle: (style: string) => void;
}

interface BlockStyleControlsProps {
  onToggle: (style: string) => void;
}

// --------- Style Button ---------
const StyleButton: FC<StyleButtonProps> = ({ label, style, onToggle }) => {
  const onClickButton = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    onToggle(style);
  };

  return (
    <span onMouseDown={onClickButton} className="ion-margin-end">
      {label}
    </span>
  );
};

// --------- Block Controls ---------
const BLOCK_TYPES = [
  { label: "قائمة غير مرتبة", style: "unordered-list-item" },
  { label: "قائمة مرتبة", style: "ordered-list-item" },
];

const BlockStyleControls: FC<BlockStyleControlsProps> = ({ onToggle }) => (
  <div>
    {BLOCK_TYPES.map((type) => (
      <StyleButton
        key={type.label}
        label={type.label}
        style={type.style}
        onToggle={onToggle}
      />
    ))}
  </div>
);

// --------- Main Component ---------
const TextEditor: FC<TextEditorProps> = ({ editorState: initialEditorState, sendToParent }) => {
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [editorData, setEditorData] = useState<string>("");

  const editor: RefObject<Editor> = useRef(null);

  useEffect(() => {
    if (editorData) {
      sendToParent(editorData);
    }
  }, [editorData]);

  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    editor.current?.focus();
  };

  const onBlockClick = (style: string) => {
    const nextState = RichUtils.toggleBlockType(editorState, style);
    setEditorState(nextState);
  };

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const content = convertToRaw(state.getCurrentContent());
    setEditorData(JSON.stringify(content));
  };

  return (
    <div onClick={focusEditor} className="RichEditor-root">
      <div className="RichEditor-controls">
        <BlockStyleControls onToggle={onBlockClick} />
      </div>
      <div className="RichEditor-editor">
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default TextEditor;
