import { colors } from "@/types";
import { Colorful, Circle } from "@uiw/react-color";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // '#'이 삭제되지 않도록 보장하고, 숫자와 알파벳만 입력 가능하게 처리
    value = `#${value
      .replace(/[^a-fA-F0-9]/g, "")
      .replace(/^#/, "")
      .slice(0, 8)}`;

    onChange(value);
  };

  return (
    <div className="w-[90%] mx-auto space-y-4">
      <Colorful
        className={"w-full:important"}
        color={value}
        onChange={(color) => {
          onChange(color.hexa);
        }}
      />
      <div>
        <Input
          className={"w-[140px]"}
          type={"text"}
          value={value}
          onChange={handleChange}
        />
      </div>
      <Circle
        colors={colors}
        color={value}
        pointProps={{
          style: {
            marginTop: 10,
            marginRight: 20,
            border: "1px solid lightGray",
          },
        }}
        onChange={(color) => {
          onChange(color.hexa);
        }}
      />
    </div>
  );
};

export default ColorPicker;
