import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export default function BackButton() {
    const history = useHistory();

    const back = useCallback(() => {
        history.goBack()
    }, [history])

    return (<button className="dchan-link m-4" onClick={back}>Go back</button>)
}