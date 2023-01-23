import logo from 'assets/images/dchan.png'

export const Spinner = ({speed = "slow", reverse = false, size = 16} : {size?: number, reverse?: boolean, speed?: "slow" | "fast" | "faster" | "sanic"}) => (
    <span className="center flex">
        <img className={`spin-${speed} h-${size} w-${size} ${reverse ? "animation-direction-reverse" : ""} animation-spin pointer-events-none`} src={logo} alt="" />
    </span>
)