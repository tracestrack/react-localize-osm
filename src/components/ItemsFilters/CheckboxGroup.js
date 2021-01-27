import CheckboxButton from "./CheckboxButton";
import {Fragment} from "react";

function toggle(selected, key, min) {
    const i = selected.indexOf(key);
    if(i === -1) {
        return [...selected, key];
    }
    if(selected.length <= min) {
        return selected;
    }
    return [
        ...selected.slice(0, i),
        ...selected.slice(i+1)
    ];
}

function CheckboxGroup({
    itemsList, 
    selected, 
    onChange, 
    min = 0,
    Checkbox = CheckboxButton
}) {
    return (
    <Fragment>
    {itemsList.map(({key, title}) => 
        <Checkbox 
            key={key} 
            vkey={key}
            title={title} 
            checked={selected.indexOf(key) !== -1} 
            onChange={() => onChange(toggle(selected, key, min))}
        />
    )}
    </Fragment>
    );
}

export default CheckboxGroup;