
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import CheckboxDropdownGroup from "./CheckboxDropdownGroup";
import LoadingButton from "../common/LoadingButton";
import AddressSearchForm from "./AddressSearchForm";
import "./ItemsFilters.css";
import { Col } from 'react-bootstrap';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";


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

  console.log(filters.tags[0]);

    return (
    <Form className="item-filters">

      <CheckboxDropdownGroup 
        title="Choose Languages"
        itemsList={languagesList}
        selected={languages}
        onChange={setLanguages}
        min={1}
      />

        <Tabs
            defaultActiveKey="tags"
            activeKey={filters.mode}
            onSelect={(k) => setFilter({mode: k})}
            transition={false}
        >
            <Tab eventKey="tags" title="Tags">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Tag to search (eg. "place", "place=city")</Form.Label>
                  <Form.Control type="text" placeholder={filters.tags[0]} onChange={tags => setFilter(tags)}/>
                </Form.Group>
            </Tab>
            <Tab eventKey="search" title="Search (Experimental)">
                <AddressSearchForm
                    search={filters.search}
                    mode={filters.searchMode}
                    onModeChange={mode => setFilter({searchMode: mode})}
                    onUpdate={search => setFilter({search})}
                />
            </Tab>
        </Tabs>
        <Row className="d-flex align-items-center">
          <Col>
                <Form.Check 
                    type="checkbox"
                    className="mr-auto text-left"
                    checked={filters.hideFilled}
                    disabled={filters.mode === "search"}
                    label="Hide filled"
                    onChange={e => setFilter({hideFilled: e.target.checked})}
                />
          </Col>
        </Row>
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
