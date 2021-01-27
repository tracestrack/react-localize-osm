import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function LoadingButton({title, onClick, loading, disabled, ...props}) {
    return (
        <Button 
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >{title}
        {loading ? 
            <Spinner 
                as="span"
                animation="border"
                size="sm"
                className="spinner-border ml-2"
            /> 
            : null}
        </Button>
    );
}
