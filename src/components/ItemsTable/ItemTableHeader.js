
export default function ItemTableHeader({languages, onClick}) {
    const titles =  ["Category", "Name",...languages.map(lang => `name:${lang}`)];
    return (
        <tr>
        {titles.map(title => 
            (<th 
                style={{cursor: "pointer"}}
                key={title}
                onClick={() => onClick(title.toLowerCase())}
            >{title}
            </th>))
        }
        </tr>
    );
}