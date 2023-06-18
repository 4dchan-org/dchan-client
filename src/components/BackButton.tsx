import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
    const navigate = useNavigate();

    const back = useCallback(() => {
        navigate(-1)
    }, [navigate])

    return (<button className="dchan-link m-4" onClick={back}>Go back</button>)
}