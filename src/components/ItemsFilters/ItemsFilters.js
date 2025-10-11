import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
  setLanguages
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
      setFilter(t, () => { getItems(); });
    },
    [setFilter, getItems], // Tells React to memoize regardless of arguments.
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
              onChange={tags => setFilter(tags.target.value)}
              onKeyPress={onKeyUp}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end gap-2">
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
