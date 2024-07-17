import { useState } from "react";

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Node } from 'react-checkbox-tree';
import CheckboxTree from 'react-checkbox-tree';

interface ICheckTreeProps {
  items: Node[];
  checked: string[];
  aoClicarCheck: (checked: string[]) => void;
}

export const CheckTreeView3: React.FC<ICheckTreeProps> = ({
  items,
  checked,
  aoClicarCheck
}) => {

  // const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  // const handleCheck = (checked: string[]) => {
  //   setChecked(checked);
  // };

  const handleExpand = (expanded: string[]) => {
    setExpanded(expanded);
  };

  return (
    <CheckboxTree
    
      nodes={items}
      checked={checked}
      expanded={expanded}
      onCheck={aoClicarCheck}
      onExpand={handleExpand}
      iconsClass="fa5"
      icons={{
        check: <span className="rct-icon rct-icon-check" />,
        uncheck: <span className="rct-icon rct-icon-uncheck" />,
        halfCheck: <span className="rct-icon rct-icon-half-check" />,
        expandClose: <span className="rct-icon rct-icon-expand-close" />,
        expandOpen: <span className="rct-icon rct-icon-expand-open" />,
        expandAll: <span className="rct-icon rct-icon-expand-all" />,
        collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
        parentClose: null,
        parentOpen: null,
        leaf: null,
      }}
    />
  );
}