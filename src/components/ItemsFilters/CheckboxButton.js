import FormCheck from "react-bootstrap/FormCheck";
import Button from "react-bootstrap/Button";

export default function CheckboxButton({vkey, title, onChange, checked}) {
    return (
    <Button 
        className="btn d-flex"
        variant={checked ? "primary" : "outline-primary"}
        size="sm"
        onClick={() => onChange(vkey)}
    >
        {title}
        <FormCheck
            checked={checked}
            onChange={() => onChange(vkey)}
        />
    </Button>
    );
}

