
import {Fragment, useState} from "react";
import Table from "react-bootstrap/Table";
import ItemTableHeader from "./ItemTableHeader";
import ItemTableRow from "./ItemTableRow"
import "./ItemsTable.css";

const compareTags = (i1, i2, field) => 
        (i1.tags[field]||"").localeCompare(i2.tags[field]||"");
 
function ItemsTable({
    languages, 
    handlers,
    items, 
    focused,
}) {
    const [sortField, setField] = useState("name");
    const [sortOrder, setOrder] = useState(1);

    const setSort = field => {
        if(field === sortField)
            setOrder(-sortOrder);            
        else
            setField(field);
    };
    
    return (
        <Fragment>
            <Table size="sm">
                <thead>
                    <ItemTableHeader 
                        languages={languages} 
                        onClick={setSort}
                    />
                </thead>
                <tbody>
                    {items
                    .filter(i => i.tags.name)
                    .sort((i1, i2) => sortOrder * compareTags(i1, i2, sortField))
                    .map(item => (
                    <ItemTableRow
                        languages={languages} 
                        key={item.id}
                        item={item}
                        focused={focused === item.id}
                        handlers={handlers}
                    />)
                    )}
                </tbody>
            </Table>
        </Fragment>
    );
    
}

export default ItemsTable;