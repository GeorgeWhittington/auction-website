import "../components/Form.css";

export function FormInput(props) {
    return (<>
        <label htmlFor={props.id}>{props.label}</label>
        <input id={props.id}  className="form-input" type={props.type} value={props.value} onChange={props.onChange}></input>
    </>);
}

export function FormBreak(props) {
    return (<><div></div><div></div></>);
}

export function FormAwesome(props) {
    return (
        <form onSubmit={props.onSubmit}>
            <div className="form-container">
                {props.children}
            </div>
            <input type="submit" className="form-submit" value={props.submitText}></input>
        </form>
    );
}
