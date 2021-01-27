import Dropdown from "react-bootstrap/Dropdown";
import FormCheck from "react-bootstrap/FormCheck";

export default function CheckboxDropdownItem({vkey, title, onChange, checked}) {
    return (
    <Dropdown.Item
        onMouseDown={e => onChange(vkey)}
        onClick={e => e.stopPropagation()}
        active={checked}
    >
        {title}
        <FormCheck
            checked={checked}
            onMouseDown={e => onChange(vkey)}
            onChange={() => {}}
        />
    </Dropdown.Item>
    );
}

