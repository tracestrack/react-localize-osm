
import {Fragment, useState} from "react";
import Table from "react-bootstrap/Table";
import ItemTableHeader from "./ItemTableHeader";
import ItemTableRow from "./ItemTableRow"
import "./ItemsTable.css";


const compareNames = (i1, i2, field) => 
        (i1.tags[field]||"").localeCompare(i2.tags[field]||"");

const compareCategoryTag = (i1, i2) =>
        i1.category.localeCompare(i2.caterory) ||
        it.item.tags[i1.category].localeCompare(i2.item.tags[i2.category]);

const compareTags = (i1, i2, field) => field === "category" ?
        compareCategoryTag(i1, i2)
        : compareNames(i1.item, i2.item, field)

 
function ItemsTable({
    languages, 
    handlers,
    items, 
    focused,
    categories
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
                    .map(item => ({
                        item,
                        category: categories.find(t => !!item.tags[t])
                    }))
                    .sort((i1, i2) => sortOrder * compareTags(i1, i2, sortField))
                    .map(({item, category}) => (
                    <ItemTableRow
                        category={category}
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