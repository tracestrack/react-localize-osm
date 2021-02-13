
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import { Col } from 'react-bootstrap';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";


export default function AddressSearchForm({search, mode, onUpdate, onModeChange}) {
    const update = upd => onUpdate({...search, ...upd});

    return (
        <Tabs
            defaultActiveKey="tagsimples"
            activeKey={mode}
            onSelect={(k) => onModeChange(k)}
            transition={false}
        >
            <Tab eventKey="simple" title="Simple">
                <Row className="d-flex align-items-center">
                    <Form.Control
                        label="search"
                        as="input"
                        type="text"
                        value={search.q}
                        onChange={e => update({q: e.target.value})}
                    />
                </Row>
            </Tab>
            <Tab eventKey="structured" title="Structured">
            <Row className="d-flex justify-items-stretch">{
                Object.entries(search)
                .filter(([k,]) => k !== "q")
                .map(([k, val]) => (
                <Col
                    xs={6}
                    key={k}
                    className="px-1"
                >
                    <Form.Control
                        label={k}
                        placeholder={k}
                        as="input"
                        type="text"
                        value={val}
                        onChange={e => update({[k]: e.target.value})}
                    />
                </Col>
            ))}</Row>
            </Tab>
        </Tabs>

    )
}