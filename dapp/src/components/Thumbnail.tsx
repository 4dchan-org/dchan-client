import { useState } from "react"
import missingSrc from 'assets/images/missing.png'
import spoilerSrc from 'assets/images/spoiler.png'

export default function Thumbnail({src, isSpoiler = false}: {src: string, isSpoiler?: boolean}) {
    const [spoiler, setSpoiler] = useState<boolean>(isSpoiler)
    const [expand, setExpand] = useState<boolean>(false)
    const [imgSrc, setImgSrc] = useState<string>(src)

    return (
        <img 
            className={!expand ? "max-w-32 max-h-32":""} loading="lazy" src={spoiler ? spoilerSrc : imgSrc} 
            onClick={() => {
                setSpoiler(expand && isSpoiler)
                setExpand(!expand)
            }} 
            onError={() => setImgSrc(missingSrc)}></img>
    )
}