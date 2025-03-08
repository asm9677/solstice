import { useCallback, useEffect, useRef } from "react";
import { Editor } from "@/types";
import { fabric } from "fabric";

interface ShortcutHookProps {
  selectedObjects: fabric.Object[];
  editor: Editor | undefined;
}

// 브라우저 환경이라 가정
const isMac =
  typeof window !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const useShortcut = ({ selectedObjects, editor }: ShortcutHookProps) => {
  // 복사해둔 객체들을 임시로 저장할 변수
  const copiedObjectsRef = useRef<fabric.Object[] | null>(null);

  // 객체 복사 로직
  const copyObjects = () => {
    if (!editor?.canvas || selectedObjects.length === 0) return;

    // 선택된 객체를 일단 배열로 복제해둘 예정이니, 원본의 clone() 호출
    const clonedObjs: fabric.Object[] = [];

    let cloneCount = 0;
    selectedObjects.forEach((obj) => {
      // Fabric의 clone 메서드 사용
      obj.clone((cloned: fabric.Object) => {
        clonedObjs.push(cloned);
        cloneCount++;

        // 모두 복제 끝나면 copiedObjectsRef에 저장
        if (cloneCount === selectedObjects.length) {
          copiedObjectsRef.current = clonedObjs;
        }
      });
    });
  };

  // 객체 붙여넣기 로직
  const pasteObjects = () => {
    if (!editor?.canvas || !copiedObjectsRef.current) return;

    const canvas = editor.canvas;
    const newSelection: fabric.Object[] = [];

    copiedObjectsRef.current.forEach((copied) => {
      // clone() 한 번 더 해서 "새로운 복제본" 만들기
      copied.clone((cloneObj: fabric.Object) => {
        // 약간 좌표를 옮겨서 붙여넣기
        cloneObj.set({
          left: (cloneObj.left ?? 0) + 20,
          top: (cloneObj.top ?? 0) + 20,
        });

        canvas.add(cloneObj);
        newSelection.push(cloneObj);
      });
    });

    // 붙여넣은 객체들 선택해주기
    canvas.discardActiveObject(); // 기존 선택 해제
    const sel = new fabric.ActiveSelection(newSelection, { canvas });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  };

  // 선택 해제(ESC)
  const clearSelection = () => {
    if (!editor?.canvas) return;
    const canvas = editor.canvas;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };
  const removeSelectedObjects = useCallback(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj) => {
        if (obj.name !== "clip") {
          canvas.remove(obj);
        }
      }); // 선택된 객체 삭제
      canvas.discardActiveObject(); // 선택 해제
      canvas.requestRenderAll(); // 화면 다시 렌더링
    }
  }, [editor?.canvas]);
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!editor?.canvas) return;
      const activeObj = editor?.canvas.getActiveObject();

      // text 편집 중이라면 객체 삭제/복사/붙여넣기 무시
      if (
        activeObj &&
        (activeObj.type === "textbox" || activeObj.type === "i-text") &&
        // @ts-expect-error-error
        activeObj.isEditing
      ) {
        // 텍스트 입력 중에는 백스페이스 / delete => 텍스트 지우기로 동작
        // 복사 / 붙여넣기는 생략
        return;
      }

      // 4-1) Backspace/Delete => 오브젝트 삭제
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        removeSelectedObjects();
        return;
      }
      // 맥: metaKey(⌘), 윈도우: ctrlKey
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // 복사 & 붙여넣기
      // (맥 command + c / windows ctrl + c)
      if (isCmdOrCtrl && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyObjects();
      }

      // (맥 command + v / windows ctrl + v)
      if (isCmdOrCtrl && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteObjects();
      }

      // (맥 command + d / windows ctrl + d) => copy+paste 동시에
      if (isCmdOrCtrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        copyObjects();
        // 약간의 지연 후 paste 해도 되고, 또는 바로 paste 호출
        // 여기서는 바로 paste:
        setTimeout(() => {
          pasteObjects();
        }, 50);
      }

      // ESC => 선택 해제
      if (e.key === "Escape") {
        e.preventDefault();
        clearSelection();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [selectedObjects, editor?.canvas]);

  return null; // 이 훅은 DOM에 직접 뭔가 그리지 않으니 반환값 없음
};

export default useShortcut;
