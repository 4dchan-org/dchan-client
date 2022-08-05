import { ReactElement, useEffect, useState } from "react";

export default function StillStuck({
    ms = 10_000,
    children,
}: {
    ms?: number,
    children: ReactElement
}) {
    const [stillStuck, setStillStuck] = useState<boolean>(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setStillStuck(true);
        }, ms);

        return () => clearTimeout(t)
    }, [ms])

    return (
        stillStuck ? children : <span />
    );
}
