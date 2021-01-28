
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import CheckboxGroup from "./CheckboxGroup";
import CheckboxDropdownGroup from "./CheckboxDropdownGroup";
import LoadingButton from "../common/LoadingButton";
import "./ItemsFilters.css";
import { Col } from 'react-bootstrap';

function ItemsFilters({
    filters, 
    setFilter, 
    tagsList,
    languages,
    languagesList, 
    getItems, 
    disabled,
    loading,
    updateItems,  
    setLanguages
}) {
    return (
    <Form className="item-filters">
        <Row>
            <Form.Text>
                Categories
            </Form.Text>
        </Row>
        <Row className="form-row row-tags">
            <CheckboxGroup 
                itemsList={tagsList}
                selected={filters.tags}
                onChange={tags => setFilter({tags})}
                min={1}
            />
        </Row>
        <Row className="d-flex align-items-center">
            <Col>
                <Form.Text className="form-text text-left">
                    Limit
                </Form.Text>
                <Form.Control
                    label="Limit"
                    as="input"
                    type="number"
                    value={filters.limit}
                    onChange={e => setFilter({limit: e.target.value})}
                />
                <Form.Check 
                    type="checkbox"
                    className="mr-auto text-left"
                    checked={filters.hideFilled}
                    label="Hide filled"
                    onChange={e => setFilter({hideFilled: e.target.checked})}
                />
            </Col>
            <Col>
                <CheckboxDropdownGroup 
                    title="Languages"
                    itemsList={languagesList}
                    selected={languages}
                    onChange={setLanguages}
                    min={1}
                />    
            </Col>          
        </Row>
        <Row className="d-flex justify-content-end">
            <LoadingButton 
                title="Get names"
                size="lg"
                disabled={disabled.items}
                onClick={getItems}
                loading={loading.items}
            />
            <LoadingButton 
                title="Update names"
                size="lg"
                disabled={disabled.updates}
                onClick={updateItems}
                loading={loading.updates}
            />
        </Row>                 
        
    </Form>
    );    
}

export default ItemsFilters;