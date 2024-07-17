import { Checkbox, FormControlLabel, Icon, styled, SvgIcon, SvgIconProps } from "@mui/material";
import { forwardRef, useState } from "react";


import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { AddBox, AddCircle, ChevronRight, ExpandMore, IndeterminateCheckBox } from "@mui/icons-material";
import { TreeItem2, TreeItem2Props, TreeView, TreeViewBaseItem } from "@mui/x-tree-view";




interface ICheckTreeView {
    items: TreeViewBaseItem[],
    children?: React.ReactNode
}

export const CheckTreeView: React.FC<ICheckTreeView> = ({ items }) => {

    const [selected, setSelected] = useState<string[]>([]);

    // function getChildById(node: TreeViewBaseItem, id: string) {
    //     let array: string[] = [];

    //     function getAllChild(nodes: RenderTree | null) {
    //         if (nodes === null) return [];
    //         array.push(nodes.id);
    //         if (Array.isArray(nodes.children)) {
    //             nodes.children.forEach((node) => {
    //                 array = [...array, ...getAllChild(node)];
    //                 array = array.filter((v, i) => array.indexOf(v) === i);
    //             });
    //         }
    //         return array;
    //     }

    //     function getNodeById(nodes: RenderTree, id: string) {
    //         if (nodes.id === id) {
    //             return nodes;
    //         } else if (Array.isArray(nodes.children)) {
    //             let result = null;
    //             nodes.children.forEach((node) => {
    //                 if (!!getNodeById(node, id)) {
    //                     result = getNodeById(node, id);
    //                 }
    //             });
    //             return result;
    //         }

    //         return null;
    //     }

    //     return getAllChild(getNodeById(node, id));
    // }

    // function getOnChange(checked: boolean, nodes: TreeViewBaseItem) {
    //     const allNode: string[] = getChildById(data, nodes.id);
    //     let array = checked
    //         ? [...selected, ...allNode]
    //         : selected.filter((value) => !allNode.includes(value));

    //     array = array.filter((v, i) => array.indexOf(v) === i);

    //     setSelected(array);
    // }

    const CustomTreeItem = forwardRef(
        (props: TreeItem2Props, ref: React.Ref<HTMLLIElement>) => (
          <TreeItem2
            ref={ref}
            {...props}
            slotProps={{
              label: {
                id: `${props.itemId}-label`,
                
              },
            }}
          />
        ),
      );

    // function CloseSquare(props: SvgIconProps) {
    //     return (
    //         <SvgIcon
    //             className="close"
    //             fontSize="inherit"
    //             style={{ width: 14, height: 14 }}
    //             {...props}
    //         >
    //             {/* tslint:disable-next-line: max-line-length */}
    //             <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    //         </SvgIcon>
    //     );
    // }

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