function ShowJson({ modifiedJson }) {
    if (typeof modifiedJson !== "object") return <span>{modifiedJson}</span>;

    if (Array.isArray(modifiedJson)) {
        return (
            <ul>
                {modifiedJson.map((value,key) => (
                    <li key={key}>
                        <ShowJson modifiedJson={value} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <ul>
            {Object.entries(modifiedJson).map(([key, value]) => (
                <li key={key}>
                    <strong>{key}: </strong> <ShowJson modifiedJson={value} />
                </li>
            ))}
        </ul>
    );
}

export default ShowJson;
