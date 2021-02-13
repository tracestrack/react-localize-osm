import {useRef, useEffect} from "react";
import Badge from "react-bootstrap/Badge";

export default function Item({
    item, 
    category,
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
    
    return (
        <tr>
            <td className="category">
                <Badge variant="info">
                    {category}
                </Badge><br />
                <Badge variant="light">
                    {item.tags[category]}
                </Badge>
            </td>
            <td>
                <span>{item.tags.name}</span>
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
    );
}
