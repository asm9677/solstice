// import { Dispatch, FC, SetStateAction } from "react";
// import { SketchPicker } from "react-color";

// interface ColorPickerProps {
//   onChangeComplete: (color: string) => void;
//   setShowPicker: Dispatch<SetStateAction<boolean>>;
//   color: string;
//   setColor: Dispatch<SetStateAction<string>>;
//   setColors: Dispatch<SetStateAction<string[]>>;
// }

// const ColorPicker: FC<ColorPickerProps> = ({
//   onChangeComplete,
//   setShowPicker,
//   color,
//   setColor,
//   setColors,
// }) => {
//   const handleChangeComplete = (color: any) => {
//     setColor(color.hex);
//     onChangeComplete(color.hex);
//   };

//   const handleAddColor = () => {
//     setColors((prevColors) => [color, ...prevColors]);
//     setShowPicker(false);
//   };

//   return (
//     <div className="absolute top-[160px] rounded-[4px] overflow-hidden z-10">
//       <SketchPicker
//         color={color}
//         onChangeComplete={handleChangeComplete}
//         onChange={(updatedColor) => setColor(updatedColor.hex)}
//       />
//       <style>{`
//         .flexbox-fix:nth-child(3) {
//           display: none !important;
//         }
//         .sketch-picker {
//           border-radius: 0px !important;
//         }
//       `}</style>
//       <div className="bg-white flex justify-between">
//         <div className="ml-2 border border-gray w-[150px] h-[30px] items-center">
//           <text className="text-lg ml-3">{color}</text>
//         </div>
//         <button
//           className="mb-2 mr-2 border border-gray w-[50px] h-[30px]"
//           onClick={handleAddColor}
//         >
//           <text className="m-2 text-sm">추가</text>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ColorPicker;