import { Checkbox } from "@/components/ui/checkbox";

const getAllDescendantIds = (node) => {
  const ids = [node.menuId];
  if (node.children?.length) {
    for (const child of node.children) {
      ids.push(...getAllDescendantIds(child));
    }
  }
  return ids;
};

const getNodeState = (node, checked) => {
  if (!node.children?.length) {
    return checked.includes(node.menuId);
  }
  const allIds = getAllDescendantIds(node);
  const checkedCount = allIds.filter((id) => checked.includes(id)).length;
  if (checkedCount === 0) return false;
  if (checkedCount === allIds.length) return true;
  return "indeterminate";
};

const MenuCheckTree = ({ nodes, checked, onChange }) => {
  const toggle = (node) => {
    const allIds = getAllDescendantIds(node);
    const state = getNodeState(node, checked);
    const set = new Set(checked);
    if (state === true) {
      allIds.forEach((id) => set.delete(id));
    } else {
      allIds.forEach((id) => set.add(id));
    }
    onChange([...set]);
  };

  return (
    <div>
      {nodes.map((node) => (
        <div key={node.menuId}>
          <div className="flex items-center gap-2 py-1.5 px-2 rounded-sm hover:bg-muted/50">
            <Checkbox
              id={`menu-${node.menuId}`}
              checked={getNodeState(node, checked)}
              onCheckedChange={() => toggle(node)}
            />
            <label
              htmlFor={`menu-${node.menuId}`}
              className="text-sm cursor-pointer select-none"
            >
              {node.menuName}
            </label>
          </div>
          {node.children?.length > 0 && (
            <div className="pl-6">
              <MenuCheckTree
                nodes={node.children}
                checked={checked}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuCheckTree;
