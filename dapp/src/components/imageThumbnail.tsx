import { Component } from "react"

interface IProps {
    src: string
}

interface IState {
    expand: boolean
}

class ThreadPage extends Component<IProps, IState> {
    constructor(props: any) {
        super(props)

        this.state = {
            expand: false
        }
    }

    render() {
        const {
            expand
        } = this.state

        return <img className={!expand ? "max-w-32 max-h-32":""} loading="lazy" src={this.props.src} onClick={() => this.toggle()}></img>
    }

    toggle() {
        const expand = !this.state.expand
        
        this.setState({
            expand
        })
    }
}

export default ThreadPage