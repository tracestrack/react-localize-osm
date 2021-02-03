import {useState, useEffect} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

export default function ChangesetBox({
    changeset, 
    handlers: {onUpdate, onClose}}
) {
    const [newComment, setComment] = useState(changeset?.tags.comment||"");

    useEffect(() => {
        setComment(changeset?.tags.comment||"");
    }, [changeset]);

    return (
        <Card 
            id="changeset-box"
            className="p-2"    
        >
            <Card.Body>
                <Row className="pb-2 justify-content-center">
                    <Form.Label>Comment:</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        value={newComment}
                        onChange={e => setComment(e.target.value)}
                    />
                </Row>
                <Row className="justify-content-center">
                    <Button 
                        className="m-1"
                        onClick={() => onUpdate({comment: newComment})}
                    >
                        Update
                    </Button>
                    <Button 
                        className="m-1"
                        onClick={onClose}
                    >
                        Close changeset
                    </Button>
                </Row>
            </Card.Body>
        </Card>
    )
}