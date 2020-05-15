import React from "react"
import { RangeModel } from "../models/range"
import { Subscription } from "../models/base"

interface SliderProps {
    model:RangeModel
}

export class Slider extends React.Component<SliderProps> {
    get model() { return this.props.model }
    private valueChangeSub:Subscription|undefined

    componentDidMount() {
        this.valueChangeSub = this.model.subscribe("value", () => {
            this.setState({}) // value change, has to rerender
        })
    }

    componentWillUnmount() {
        if (this.valueChangeSub) this.valueChangeSub.unsubscribe()
    }

    private posStartDrag = 0
    private valStart = 0
    private sliderBg = React.createRef<HTMLDivElement>()

    onMouseMove(e:MouseEvent) {
        if (this.sliderBg.current) {
            e.preventDefault()
            e.stopPropagation()
            const sliderWidth = this.sliderBg.current.clientWidth // corresponds to change in range max - min
            let offs = e.clientX - this.posStartDrag
            if (sliderWidth > 0) {
                let change = offs * (this.model.max - this.model.min) / sliderWidth
                this.model.val = this.valStart + change // this will update the display automatically
            }
        }

    }

    private moveListener = this.onMouseMove.bind(this)
    private upListener = this.onMouseUp.bind(this)

    onMouseDown(e:React.MouseEvent) {
        this.posStartDrag = e.clientX
        window.addEventListener("mousemove", this.moveListener, { capture: true})
        window.addEventListener("mouseup", this.upListener, { capture: true})
        this.valStart = this.model.val
    }

    onMouseUp(e:MouseEvent) {
        window.removeEventListener("mousemove", this.moveListener, {capture:true})
        window.removeEventListener("mouseup", this.upListener, {capture:true})
    }

    render() {
        let model = this.model;
        const left = (model.val - model.min) * 100 / (model.max - model.min) // left pos in percentage

        return <div className="slider bg" ref={this.sliderBg}>
                    <div style={ { left: `${left}%`, top:"50%", width:0, height:0, position:"absolute"  } }>
                        <span className="thumb" onMouseDown={e=>this.onMouseDown(e)} ></span>
                    </div>
               </div>
    }
}