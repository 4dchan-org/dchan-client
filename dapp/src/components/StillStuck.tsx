import { ReactElement, useState } from "react";

export default function StillStuck({
    ms = 10_000,
    children,
}: {
    ms?: number,
    children: ReactElement
}) {
    const [stillStuck, setStillStuck] = useState<boolean>(false);

    setTimeout(() => {
        setStillStuck(true);
    }, ms);

    return (
        stillStuck ? children : <span />
    );
}
