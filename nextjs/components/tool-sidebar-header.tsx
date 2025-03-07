interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
}

const ToolSidebarHeader = ({ title, description }: ToolSidebarHeaderProps) => {
  return (
    <div className={"p-4 border-b space-y-1 h-[68px"}>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className={"text-sm text-gray-700"}>{description}</p>}
    </div>
  );
};

export default ToolSidebarHeader;
