import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import TagTextInput from "./TagTextInput";
import LoadingButton from "../common/LoadingButton";
import "./ItemsFilters.css";
import React, { useCallback } from 'react';


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
  setLanguages,
  showTags,
  toggleTags,
  itemCount
}) {

  const onKeyUp = useCallback(
    (e) => {
      if (e.charCode === 13) {
        getItems();
      }
    },
    [getItems], // Tells React to memoize regardless of arguments.
  );


  const onClickShortcut = useCallback(
    (e) => {
      let t = e.target.innerText;
      console.log(t);
      setFilter({...filters, tags: t}, () => { getItems(); });
    },
    [setFilter, getItems, filters], // Tells React to memoize regardless of arguments.
  );

  const onTypeChange = useCallback(
    (type) => {
      setFilter({...filters, osmType: type});
    },
    [setFilter, filters]
  );

  const onTagsChange = useCallback(
    (tags) => {
      setFilter({...filters, tags: tags.target.value});
    },
    [setFilter, filters]
  );

  return (
    <Form className="item-filters">
      <Row className="mb-2 align-items-end">
        <Col md={3}>
          <TagTextInput
            title="Language codes"
            selected={languages}
            onChange={setLanguages}
          />
        </Col>
        <Col md={9}>
          <Form.Group className="mb-0">
            <div className="d-flex align-items-center mb-1">
              <Form.Label className="mb-0 me-2">
                Custom filter
              </Form.Label>
              <div className="tag-shortcuts">
                <button type="button" className="tag-link" onClick={onClickShortcut}>place=city</button>
                <button type="button" className="tag-link" onClick={onClickShortcut}>boundary</button>
                <button type="button" className="tag-link" onClick={onClickShortcut}>leisure</button>
                <button type="button" className="tag-link" onClick={onClickShortcut}>highway</button>
                <button type="button" className="tag-link" onClick={onClickShortcut}>waterway</button>
              </div>
            </div>
            <Form.Control
              type="text"
              size="sm"
              placeholder="e.g. amenity=restaurant, place=city"
              value={filters.tags}
              onChange={onTagsChange}
              onKeyPress={onKeyUp}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-2 align-items-center">
        <Col md={3}>
          <div className="d-flex align-items-center gap-2">
            <Form.Label className="mb-0 me-2">Type</Form.Label>
            <ButtonGroup size="sm">
              <Button
                variant={filters.osmType === 'node' ? 'primary' : 'outline-primary'}
                onClick={() => onTypeChange('node')}
              >
                Node
              </Button>
              <Button
                variant={filters.osmType === 'way' ? 'primary' : 'outline-primary'}
                onClick={() => onTypeChange('way')}
              >
                Way
              </Button>
              <Button
                variant={filters.osmType === 'relation' ? 'primary' : 'outline-primary'}
                onClick={() => onTypeChange('relation')}
              >
                Relation
              </Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col md={9} className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={toggleTags}
          >
            <i className={`fa fa-${showTags ? 'eye-slash' : 'eye'} me-1`}></i>
            {showTags ? 'Hide' : 'Show'} Tags
          </Button>
          <span className="text-muted small align-self-center me-2">
            {itemCount} items
          </span>
          <LoadingButton
            title="Get names"
            variant="primary"
            size="sm"
            onClick={getItems}
            loading={loading.items}
            disabled={disabled.items}
          />
          <LoadingButton
            title="Update names"
            variant="success"
            size="sm"
            disabled={disabled.updates}
            onClick={updateItems}
            loading={loading.updates}
          />
        </Col>
      </Row>
    </Form>
  );
}

export default ItemsFilters;
