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
            this.updateSliderStyles() // update thumb and progress pos
        })
        
        this.setState({}) // trigger a refresh, so refs get sizes
        if (this.thumb.current) {
            this.thumb.current.setAttribute("touch-action",  "none") // in order for the pointerEvent polyfill to work
        }
    }

    componentDidUpdate() {
        this.updateSliderStyles() // style refresh
    }

    componentWillUnmount() {
        if (this.valueChangeSub) this.valueChangeSub.unsubscribe()
    }

    private updateSliderStyles() {
        if (this.sliderBg.current && this.thumb.current) {
            let model = this.model;
            const trackSize = this.sliderBg.current.clientWidth - this.thumb.current.clientWidth
            const thumbWidth = this.thumb.current.clientWidth
            let pos = (model.val - model.min) * trackSize / (model.max - model.min) // left pos on track
            let posCross = -(this.thumb.current.clientHeight - this.sliderBg.current.clientHeight) / 2;
            this.thumb.current.setAttribute("style", `left: ${pos}px; top:${posCross}px`)
            if (this.sliderProgress.current) {
                this.sliderProgress.current.setAttribute("style", `width: ${pos + thumbWidth / 2}px`)
            }
        }
    }

    private posStartDrag = 0
    private valStart = 0
    private sliderBg = React.createRef<HTMLDivElement>()
    private thumb = React.createRef<HTMLSpanElement>()
    private sliderProgress = React.createRef<HTMLDivElement>()
    private dragging = false

    onPointerMove(e:MouseEvent) {
        if (this.dragging && this.sliderBg.current && this.thumb.current) {
            
            const trackSize = this.sliderBg.current.clientWidth - this.thumb.current.clientWidth // corresponds to change in range max - min
            let offs = e.clientX - this.posStartDrag
            if (trackSize > 0) {
                let change = offs * (this.model.max - this.model.min) / trackSize
                this.model.val = this.valStart + change // this will update the display automatically
            }
        }
    }

    moveListener = (e:MouseEvent) => this.onPointerMove(e)
    upListener = (e:MouseEvent) => this.onPointerUp(e)

    onPointerDown(e:React.MouseEvent) {
        // todo: check button/finger here
        this.posStartDrag = e.clientX
        this.valStart = this.model.val;
        this.dragging = true
        window.addEventListener("pointermove", this.moveListener)
        window.addEventListener("pointerup", this.upListener)
    }

    onPointerUp(e:MouseEvent) {
        this.dragging = false
        window.removeEventListener("mousemove", this.moveListener)
        window.removeEventListener("mouseup", this.upListener)
    }

    render() {
        return <div className="slider bg" ref={this.sliderBg}>
                    <div className="slider progress" ref={this.sliderProgress}></div>
                    <span className="thumb" ref={this.thumb} 
                          onPointerDown={e=>this.onPointerDown(e)}>
                        {this.props.children}
                    </span>
               </div>
    }
}