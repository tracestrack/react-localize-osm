
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
      <Row className="form-row row-tags">
        <CheckboxDropdownGroup
          title="Tags"
          itemsList={tagsList}
          selected={filters.tags}
          onChange={tags => setFilter({tags})}
          min={1}
        />

        <CheckboxDropdownGroup 
          title="Languages"
          itemsList={languagesList}
          selected={languages}
          onChange={setLanguages}
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
          </Col>
          <Col>
                <Form.Check 
                    type="checkbox"
                    className="mr-auto text-left"
                    checked={filters.hideFilled}
                    label="Hide filled"
                    onChange={e => setFilter({hideFilled: e.target.checked})}
                />
          </Col>
        </Row>
        <Row className="d-flex justify-content-end">
            <LoadingButton 
                title="Get names"
                variant="primary"
                disabled={disabled.items}
                onClick={getItems}
                loading={loading.items}
            />
            <LoadingButton 
                title="Update names"
                variant="success"
                disabled={disabled.updates}
                onClick={updateItems}
                loading={loading.updates}
            />
        </Row>                 
        
    </Form>
    );    
}

export default ItemsFilters;
