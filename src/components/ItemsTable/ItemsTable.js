
import React from "react";
import Table from "react-bootstrap/Table";
import ItemTableHeader from "./ItemTableHeader";
import ItemTableRow from "./ItemTableRow"
import "./ItemsTable.css";


function ItemsTable({
    loading, 
    languages, 
    handlers,
    items, 
    focused,
}) {
    return (
        <React.Fragment>
            <Table size="sm">
                <thead>
                    <ItemTableHeader languages={languages} />
                </thead>
                <tbody>
                    {items
                    .filter(i => i.tags.name)
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
            {loading ? (
            <React.Fragment>
                <div className="items-loading-overlay" />
            </React.Fragment>
            ) 
            : null}
        </React.Fragment>
    );
    
}

export default ItemsTable;