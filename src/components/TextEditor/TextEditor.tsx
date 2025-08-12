import {
  convertToRaw,
  Editor,
  EditorState,
  RichUtils
} from "draft-js";
import "draft-js/dist/Draft.css";
import {
  FC,
  MouseEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

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

const StyleButton: FC<StyleButtonProps> = ({ label, style, onToggle }) => {
  const onClickButton = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    onToggle(style);
    console.log(`Style toggled: ${style}`);
    
  };

  return (
    <span onMouseDown={onClickButton} className="ion-margin-end">
      {label}
    </span>
  );
};

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

const TextEditor: FC<TextEditorProps> = ({ editorState: initialEditorState, sendToParent }) => {
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);

  const editor: RefObject<Editor> = useRef(null);


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
      sendToParent(JSON.stringify(content));

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
