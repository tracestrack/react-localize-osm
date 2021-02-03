import Button from "react-bootstrap/Button";
import ChangesetBox from "./ChanesetBox";
import "./ChangesetSettings.css";
import {useState, useEffect} from "react";


export default function ChangesetSettings({changeset, handlers}) {
    const [visible, setVisible] = useState();

    useEffect(() => {
        if(!changeset)
            setVisible(0);
    }, [changeset]);

    return (
        <div id="changeset">
            <Button 
                id="changeset-button"
                onClick={() => setVisible(!visible)}
            >{
                changeset ? 
                `Active changeset: ${changeset.id}`
                : "No active changeset"
            }</Button>
            {visible ?
            <ChangesetBox  
                changeset={changeset}
                handlers={handlers}
            />
            : null}
        </div>
    );
}