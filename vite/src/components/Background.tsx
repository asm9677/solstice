const Background = () => {
  return (
    <div className="flex w-[300px] h-screen">
      <div className="flex flex-col">
        <div>
          <text className="text-8xl text-red-500">색상 추가</text>
        </div>
        <button className="w-[200px] h-[200px] bg-red">+</button>
      </div>
      <div>
        <text>기본 색상</text>
      </div>
    </div>
  );
};

export default Background;
