import { Checkbox, FormControlLabel, Icon, styled, SvgIcon, SvgIconProps } from "@mui/material";
import { forwardRef, useState } from "react";


import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { ChevronRight, ExpandMore, IndeterminateCheckBox } from "@mui/icons-material";
import { TreeItem2, TreeItem2Label, TreeItem2Props, TreeView, TreeViewBaseItem } from "@mui/x-tree-view";




interface ICheckTreeView {
  items: TreeViewBaseItem[],
  children?: React.ReactNode
}

interface CustomLabelProps {
  itemId: string;
  children: string;
  className: string;
  onChange: (value: string) => void;
}



const CustomLabel = (props: CustomLabelProps) => {
  const { itemId, children, onChange, ...other } = props;
  const [selected, setSelected] = useState<string[]>([]);

console.log(itemId);
  // const getOnChange = (checked: boolean, nodes: RenderTree) => {
  //   const allNode: string[] = getChildById(nodes, nodes.id);
  //   let array = checked
  //     ? [...selected, ...allNode]
  //     : selected.filter((value) => !allNode.includes(value));

  //   array = array.filter((v, i) => array.indexOf(v) === i);

  //   setSelected(array);
  // }

  return (
    <TreeItem2Label {...other}>
      <FormControlLabel
        control={
          <Checkbox

            // checked={selected.some((item) => item === nodes.id)}

            // onChange={(e) =>
            //   getOnChange(e.currentTarget.checked, nodes)
            // }
            onClick={(e) => e.stopPropagation()}
            // onClick={(e) => alert('oi -> ' + e.)}

          />
        }
        label=""
      // label={<>{nodes.name}</>}
      // key={nodes.id}
      />
      {children}
    </TreeItem2Label>
  );
}

const CustomTreeItem = forwardRef(
  (props: TreeItem2Props, ref: React.Ref<HTMLLIElement>) => {
    
    return (
      <TreeItem2        
        ref={ref}
        {...props}
        slots={{
          label: CustomLabel,
        }}
        
      />
    );
  });

export const CheckTreeView2: React.FC<ICheckTreeView> = ({ items }) => {


  return (
    <RichTreeView
      aria-label="customized"
      defaultExpandedItems={['1']}
      slots={{
        expandIcon: ChevronRight,
        collapseIcon: ExpandMore,
        item: CustomTreeItem
      }}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
      items={items}
    />
  );
}