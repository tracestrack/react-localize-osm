import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import CheckboxDropdownGroup from "./CheckboxDropdownGroup";
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
      setFilter(t, () => {getItems();});
    },
    [setFilter, getItems], // Tells React to memoize regardless of arguments.
  );

    return (
    <Form className="item-filters">

      <CheckboxDropdownGroup 
        title="Choose Languages"
        itemsList={languagesList}
        selected={languages}
        onChange={setLanguages}
        min={1}
      />


                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Tag to search: </Form.Label>
                  <Button variant="outline-secondary" size="sm" onClick={onClickShortcut}>place=city</Button>
                  <Button variant="outline-secondary" size="sm" onClick={onClickShortcut}>boundary</Button>
                  <Button variant="outline-secondary" size="sm" onClick={onClickShortcut}>leisure</Button>
                  <Button variant="outline-secondary" size="sm" onClick={onClickShortcut}>highway</Button>
                  <Button variant="outline-secondary" size="sm" onClick={onClickShortcut}>waterway</Button>
                  <Form.Control type="text" value={filters.tags} onChange={tags => setFilter(tags.target.value)} onKeyPress={onKeyUp} />
                </Form.Group>

        <Row className="d-flex justify-content-end">
            <LoadingButton
                title="Get names"
                variant="primary"
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
