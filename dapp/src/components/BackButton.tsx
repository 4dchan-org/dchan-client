import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export default function BackButton() {
    const history = useHistory();

    const back = useCallback(() => {
        history.goBack()
    }, [history])

    return (<button className="text-blue-600 visited:text-purple-600 m-4" onClick={back}>Go back</button>)
}