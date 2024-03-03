import Form from "react-bootstrap/Form";

import { useEffect, useState } from "react";

export default function TagTextInput({ title, selected, onChange }) {
    // react-bootstrap dropdown has a bad habit to close after selecting an item
    // that's working with menus okay, but not with checkbox group

    const [dpShow, setDpShow] = useState(false);

    useEffect(() => {
        if (dpShow) {
            const fn = document.addEventListener("click", () => {
                setDpShow(false);
                document.removeEventListener("click", fn);
            });
        }
    }, [dpShow]);

    const onTextChange = e => {
        let langs = e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
         onChange(langs);
    }

    return (
        <Form.Group controlId="formBasicEmail">
            <Form.Label>{title}</Form.Label>
            <Form.Control type="tags" placeholder="Enter language codes. Example: en, nl, zh" defaultValue={selected} onChange={onTextChange} />
            <Form.Text className="text-muted">
                Use comma to separate languages. Example: en, nl, zh
            </Form.Text>
        </Form.Group>
    );
}