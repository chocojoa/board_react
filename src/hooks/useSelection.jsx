const useSelection = () => {
  const [rowSelection, setRowSelection] = useState({});

  return {
    rowSelection,
    onRowSelectionChange: setRowSelection,
  };
};

export default useSelection;
