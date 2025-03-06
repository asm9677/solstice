"use client"

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ColorPicker from "./ColorPicker";
import ColorPalette from "./ColorPalette";

const BackgroundMenu = () => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000");
  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>("");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleRemoveColor = (index: number) => {
    setColors((prevColors) => prevColors.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col w-[300px] h-full">
      <div className="flex flex-col m-4">
        <text className="text-sm text-white">색상 추가</text>
        <div className="grid grid-cols-5 w-[250px] flex-row flex-wrap mt-3">
          <button
            className="bg-white relative h-[50px]  mt-1 cursor-pointer"
            onClick={togglePicker}
          >
            +
          </button>
          {showPicker && (
            <ColorPicker
              onChangeComplete={handleColorChange}
              setShowPicker={setShowPicker}
              color={color}
              setColor={setColor}
              setColors={setColors}
            />
          )}
          {colors.map((color, index) => {
            if (index >= 14) {
              return;
            }

            return (
              <div className="relative group h-[50px] overflow-hidden mt-1">
                <button
                  key={index}
                  className={`h-[50px] w-[50px] border cursor-pointer ${
                    currentColor === color
                      ? "border-white"
                      : "border-transparent"
                  } hover:border-white group-hover:border-white`}
                  style={{ backgroundColor: colors[index] }}
                  onClick={() => setCurrentColor(colors[index])}
                ></button>

                <button
                  className="absolute top-0 right-0 w-3 h-3 flex items-center justify-center bg-black text-white text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveColor(index)}
                >
                  <IoMdClose />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-b-2 mx-4 my-2" />
      <div className="flex flex-col m-4">
        <text className="text-sm text-white mb-1">기본 색상</text>
        <ColorPalette
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
      </div>
    </div>
  );
};

export default BackgroundMenu;