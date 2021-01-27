import CheckboxGroup from "../ItemsFilters/CheckboxGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import CheckboxDropdownItem from "./CheckboxDropdownItem";

import {useEffect, useState} from "react";

export default function CheckboxDropdownGroup({title, itemsList, selected, onChange, min}) {
    // react-bootstrap dropdown has a bad habit to close after selecting an item
    // that's working with menus okay, but not with checkbox group

    const [dpShow, setDpShow] = useState(false);

    useEffect(() => {
        if(dpShow) {
            const fn = document.addEventListener("click", () => {
                setDpShow(false);
                document.removeEventListener("click", fn);
            });
        }
    }, [dpShow]);

    const onClickDp = e => {
        setDpShow(!dpShow);
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <DropdownButton
            title={title}
            show={dpShow}
            onClick={onClickDp}
            variant="outline-primary"
        >
            <CheckboxGroup 
                Checkbox={CheckboxDropdownItem}
                itemsList={itemsList}
                selected={selected}
                rootCloseEvent="mousedown"
                onChange={onChange}
                min={min}
            />
        </DropdownButton>       
    );
}