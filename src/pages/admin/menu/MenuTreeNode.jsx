const MenuTreeNode = ({ node, selectedMenuId, onSelect }) => {
  return (
    <div>
      <div
        className={`px-2 py-1 rounded cursor-pointer text-sm ${
          node.menuId === selectedMenuId
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        onClick={() => onSelect(node.menuId)}
      >
        {node.menuName}
      </div>
      {node.children?.length > 0 && (
        <div className="pl-4">
          {node.children.map((child) => (
            <MenuTreeNode
              key={child.menuId}
              node={child}
              selectedMenuId={selectedMenuId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuTreeNode;
