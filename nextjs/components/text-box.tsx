import { Text } from "react-konva";

export const TextBox = ({ transformerRef, stageRef, onClick, ...text }) => {
  const handleTextDblClick = (textNode, e) => {
    const textPosition = textNode.absolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${stageBox.top + textPosition.y}px`;
    textarea.style.left = `${stageBox.left + textPosition.x}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();

    textarea.focus();

    function removeTextarea() {
      textNode.text(textarea.value);
      document.body.removeChild(textarea);
      textNode.show();
      transformerRef.current.show();
      transformerRef.current.forceUpdate();
    }

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        removeTextarea();
      }
      if (e.key === "Escape") {
        removeTextarea();
      }
    });

    setTimeout(() => {
      window.addEventListener("click", function handleClickOutside(e) {
        if (e.target !== textarea) {
          removeTextarea();
          window.removeEventListener("click", handleClickOutside);
        }
      });
    });
  };

  return (
    <Text
      key={text.id}
      {...text}
      onClick={(e) => onClick(text.id, e)}
      onDblClick={(e) => handleTextDblClick(e.target, e)}
    />
  );
};
