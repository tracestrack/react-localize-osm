function TableHeader({titles}) {
    return (
        <tr>
            {titles.map(title => (<th key={title}>{title}</th>))}
        </tr>
    );
}

export default function ItemTableHeader({languages}) {
    return TableHeader({
        titles: ["Name", ...languages.map(lang => `Name:${lang}`)]
    });
}