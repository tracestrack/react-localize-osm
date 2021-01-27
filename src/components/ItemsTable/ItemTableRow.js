import {useRef, useEffect} from "react";

export default function Item({
    item, 
    languages, 
    focused,
    handlers: {onFocus, onBlur, onChange, onIconClick}
}) {
    const firstInput = useRef(null);
    useEffect(() => {
        if (focused) {
            firstInput.current.focus();
        }
    }, [focused]);
    return (
        <tr key={item.id}>
            <td>
                <i 
                    className="fa fa-crosshairs icon-btn mt-1" 
                    style={{float: "left"}} 
                    onClick={() => onIconClick(item)}
                />
                <span>{item.tags.name}</span>
            </td>
            {languages.map((lang, i) => (
            <td key={lang}>
                <input
                    type="text"
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