import React, { useRef } from "react";

interface ImageUploaderProps {
  onFileSelect: (file: File | null, previewUrl: string | null) => void;
}

const ImageUploader = React.forwardRef(({ onFileSelect }: ImageUploaderProps, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    handleUpload: () => {
      fileInputRef.current?.click();
    }
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const file = event.target.files?.[0];    
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        onFileSelect(file, reader.result as string); // 상위 컴포넌트로 데이터 전달
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
      onFileSelect(null, null);
    }
  };

  return (
    <input
      type="file"
      ref={fileInputRef}
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  );
});

export default ImageUploader;
