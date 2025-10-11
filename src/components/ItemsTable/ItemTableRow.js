import {useRef, useEffect} from "react";
import Badge from "react-bootstrap/Badge";

export default function Item({
    item,
    filterTags,
    languages,
    focused,
    handlers: {onFocus, onBlur, onChange, onIconClick}
}) {
    const firstInput = useRef(null);
    useEffect(() => {
        if (focused &&
            document.activeElement.id.indexOf(item.id+"") !== 0) {
            firstInput.current.focus();
        }
    }, [focused, item]);

    const osmUrl = `https://www.openstreetmap.org/${item.type}/${item.id}`;

    const typeColors = {
        node: 'primary',
        way: 'success',
        relation: 'warning'
    };

    // Keep all tags except internal tags (starting with _)
    const relevantTags = Object.entries(item.tags)
        .filter(([key, value]) =>
            !key.startsWith('_') &&
            value !== undefined &&
            value !== null
        )
        .sort(([keyA], [keyB]) => {
            // Sort: non-name tags first, then name, then name:* alphabetically
            const aIsName = keyA === 'name' || keyA.startsWith('name:');
            const bIsName = keyB === 'name' || keyB.startsWith('name:');

            if (aIsName && !bIsName) return 1;
            if (!aIsName && bIsName) return -1;

            // Both are name tags or both are non-name tags
            if (keyA === 'name') return -1;
            if (keyB === 'name') return 1;

            return keyA.localeCompare(keyB);
        });

    // Check if a tag matches the filter
    const isFilterTag = (key, value) => {
        if (!filterTags || filterTags.length === 0) return false;

        return filterTags.some(filterTag => {
            // Handle "key=value" format
            if (filterTag.includes('=')) {
                const [filterKey, filterValue] = filterTag.split('=');
                return key === filterKey && value === filterValue;
            }
            // Handle "key" only format
            return key === filterTag;
        });
    };

    const columnCount = 4 + languages.length; // ID + Type + Name + languages columns

    return (
        <>
            <tr className="main-row">
                <td className="id-cell">
                    <a
                        href={osmUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`View ${item.type} ${item.id} on OpenStreetMap`}
                    >
                        {item.id}
                    </a>
                </td>
                <td className="type-cell">
                    <Badge bg={typeColors[item.type] || 'secondary'} className="text-capitalize">
                        {item.type}
                    </Badge>
                </td>
                <td>

                  {item.tags.wikidata && (<span><a target="_blank" rel="noreferrer" href={`https://www.wikidata.org/wiki/${item.tags.wikidata}`}>{item.tags.name}</a></span>)}
                  {!item.tags.wikidata && (<span>{item.tags.name}</span>)}

                    <i
                        className="fa fa-crosshairs icon-btn mt-1"
                        style={{float: "right"}}
                        onClick={() => onIconClick(item)}
                    />
                </td>
                {languages.map((lang, i) => (
                <td key={lang}>
                    <input
                        type="text"
                        id={item.id + lang}
                        ref={i ? null : firstInput}
                        value={item.tags[`name:${lang}`]||""}
                        onChange={e => onChange(item, lang, e.target.value)}
                        onFocus={() => focused ? null : onFocus(item.id)}
                        onBlur={() => focused ? onBlur(item.id) : null}
                    />
                </td>))}
            </tr>
            <tr className="tags-row">
                <td colSpan={columnCount} className="tags-cell">
                    <div className="tags-label">Tags:</div>
                    {relevantTags.map(([key, value]) => {
                        const isHighlighted = isFilterTag(key, value);
                        const isNameTag = key === 'name' || key.startsWith('name:');

                        return (
                            <span key={key} className="tag-pair">
                                <Badge
                                    bg={isHighlighted ? "warning" : (isNameTag ? "secondary" : "info")}
                                    className={isHighlighted ? "filter-tag" : ""}
                                >
                                    {key}
                                </Badge>
                                <Badge
                                    bg="light"
                                    text="dark"
                                    className={isHighlighted ? "filter-tag-value" : ""}
                                >
                                    {value}
                                </Badge>
                            </span>
                        );
                    })}
                </td>
            </tr>
        </>
    );
}
