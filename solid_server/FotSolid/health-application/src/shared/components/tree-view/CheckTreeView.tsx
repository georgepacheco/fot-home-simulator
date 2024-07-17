import React, { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export interface CheckedItems {
  [key: string]: {
    checked: boolean;
    read: boolean;
    write: boolean;
    append: boolean;
  };
}

interface ICheckTree {
  checkedItems: CheckedItems;
  handleChange: (updatedCheckedItems: CheckedItems) => void;
}

export const CheckTreeView: React.FC<ICheckTree> = ({ checkedItems, handleChange }) => {

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [key, type] = event.target.name.split('.');
    const isChecked = event.target.checked;
    const updatedCheckedItems = { ...checkedItems };

    if (type === 'checked') {
      // Update the main checkbox and all its children
      updatedCheckedItems[key] = {
        checked: isChecked,
        append: isChecked,
        read: isChecked,
        write: isChecked
      };
    } else {
      // Update individual child checkboxes
      updatedCheckedItems[key] = {
        ...updatedCheckedItems[key],
        [type]: isChecked
      };
    }

    // Pass the updated state to the parent
    handleChange(updatedCheckedItems);
  };

  const renderCheckboxes = () => {
    return Object.keys(checkedItems).map((key) => {
      const item = checkedItems[key];

      return (
        <div key={key}>
          <FormControlLabel
            control={
              <Checkbox
                checked={item.checked}
                onChange={onCheckboxChange}
                name={`${key}.checked`}
              />
            }
            label={key.charAt(0).toUpperCase() + key.slice(1)}
          />
          {item.checked && (
            <div style={{ paddingLeft: 20 }}>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.read}
                    onChange={onCheckboxChange}
                    name={`${key}.read`}
                  />
                }
                label="Read"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.write}
                    onChange={onCheckboxChange}
                    name={`${key}.write`}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.append}
                    onChange={onCheckboxChange}
                    name={`${key}.append`}
                  />
                }
                label="Append"
              />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <FormGroup>
      {renderCheckboxes()}
    </FormGroup>
  );
};
