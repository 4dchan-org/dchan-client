import logo from 'assets/images/dchan.png'

const Spinner = ({speed = "slow", size = 16} : {size?: number, speed?: "slow" | "fast" | "faster" | "sanic"}) => (
    <span className="center flex">
        <img className={`spin-${speed} h-${size} w-${size}` + " animation-spin pointer-events-none"} src={logo} alt="dchan" />
    </span>
)

export default Spinner