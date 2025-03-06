import { Dispatch, FC, SetStateAction } from "react";

const grayScalePalette = [
  "#010101",
  "#595a5c",
  "#a6a9ac",
  "#dadddd",
  "#ffffff",
];
const colorPalette = [
  "#eb2327",
  "#f15b2a",
  "#fced1f",
  "#04a54f",
  "#28abe2",
  "#27255f",
  "#90298d",
  "#b29b34",
  "#8a5e3b",
  "#3b2416",
];

interface ColorPaletteProps {
  currentColor: string;
  setCurrentColor: Dispatch<SetStateAction<string>>;
}

const ColorPalette: FC<ColorPaletteProps> = ({
  currentColor,
  setCurrentColor,
}) => {
  return (
    <div className="mt-3">
      {grayScalePalette.map((color, index) => {
        return (
          <button
            key={index}
            className={`h-[50px] w-[50px] border cursor-pointer ${
              currentColor === color ? "border-white" : "border-transparent"
            } hover:border-white group-hover:border-white`}
            style={{ backgroundColor: grayScalePalette[index] }}
            onClick={() => setCurrentColor(grayScalePalette[index])}
          ></button>
        );
      })}

      <div className="mt-[20px]">
        {colorPalette.map((color, index) => {
          return (
            <button
              key={index}
              className={`h-[50px] w-[50px] border ${
                currentColor === color ? "border-white" : "border-transparent"
              } hover:border-white group-hover:border-white`}
              style={{ backgroundColor: colorPalette[index] }}
              onClick={() => setCurrentColor(colorPalette[index])}
            ></button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPalette;