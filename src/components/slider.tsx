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
    private dragging = false

    onPointerMove(e:React.PointerEvent) {
        if (this.dragging && this.sliderBg.current) {
            
            const sliderWidth = this.sliderBg.current.clientWidth // corresponds to change in range max - min
            let offs = e.clientX - this.posStartDrag
            if (sliderWidth > 0) {
                let change = offs * (this.model.max - this.model.min) / sliderWidth
                this.model.val = this.valStart + change // this will update the display automatically
            }
        }
    }

    onPointerDown(e:React.PointerEvent) {
        // todo: check button/finger here
        this.posStartDrag = e.clientX
        this.valStart = this.model.val;
        (e.target as any).setPointerCapture(e.pointerId) // move events will be forwarded to this item, as expected
                                                         // see: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#Pointer_capture
        this.dragging = true
    }

    onPointerUp(e:React.PointerEvent) {
        this.dragging = false
    }

    render() {
        let model = this.model;
        const left = (model.val - model.min) * 100 / (model.max - model.min) // left pos in percentage

        return <div className="slider bg" ref={this.sliderBg}>
                    <div style={ { left: `${left}%`, top:"50%", width:0, height:0, position:"absolute"  } }>
                        <span className="thumb" onPointerDown={e=>this.onPointerDown(e)} onPointerMove={e=>this.onPointerMove(e)} onPointerUp={e=> this.onPointerUp(e)} ></span>
                    </div>
               </div>
    }
}