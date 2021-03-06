import React, { HTMLAttributes, MouseEvent, WheelEvent, Ref,ClassAttributes, RefObject, UIEvent } from "react";
interface Props extends HTMLAttributes<HTMLDivElement>
{
    button?: number;
    scaleFactor?: number;
    grabCursor?: string;
    refobj?: Ref<HTMLDivElement>;
    key?: string;
}
interface State
{
    offsetX: number;
    offsetY: number;
    scale: number;
    drag: boolean;
}
class Vector
{
    x: number = 0;
    y: number = 0;
}
const vec2 = (x: number, y: number) => { return { x: x, y: y } };
export default class ViewPort extends React.Component<Props, State>
{
    mouseDownPos: Vector = { x: 0, y: 0 };
    originalOffset: Vector = { x: 0, y: 0 };
    drag: boolean = false;
    viewportRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props)
    {
        super(props);
        this.state = {
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            drag: false
        };
        this.viewportRef = this.props.refobj? this.props.refobj as RefObject<HTMLDivElement> : React.createRef<HTMLDivElement>();
    }
    mousePosition(clientPos: Vector): Vector
    {
        let element = this.viewportRef.current as HTMLDivElement;
        let rect = element.getBoundingClientRect();
        let style = getComputedStyle(element);
        return {
            x: (clientPos.x - rect.left - parseFloat(style.paddingLeft as string) - this.state.offsetX) / this.state.scale,
            y: (clientPos.y - rect.top - parseFloat(style.paddingTop as string) - this.state.offsetY) / this.state.scale
        };
    }
    onMouseDown(e: MouseEvent<HTMLDivElement>)
    {
        if (this.props.onMouseDown)
            this.props.onMouseDown(e);
        let button = this.props.button === undefined ? 0 : this.props.button;
        if (e.button === button)
        {
            this.originalOffset = { x: this.state.offsetX, y: this.state.offsetY };
            this.mouseDownPos = { x: e.clientX, y: e.clientY };
            this.drag = true;
            this.setState({ drag: true });
        }
    }
    onMouseUp(e: MouseEvent<HTMLDivElement>)
    {
        if (this.props.onMouseUp)
            this.props.onMouseUp(e);
        let button = this.props.button === undefined ? 0 : this.props.button;
        if (e.button === button)
        {
            this.drag = false;
            this.setState({ drag: false });
        }
    }
    onMouseMove(e: MouseEvent<HTMLDivElement>)
    {
        if (this.props.onMouseMove)
            this.props.onMouseMove(e);
        if (!this.drag)
            return;
        let dPos: Vector = { x: e.clientX - this.mouseDownPos.x, y: e.clientY - this.mouseDownPos.y };
        this.setState({
            offsetX: this.originalOffset.x + dPos.x,
            offsetY: this.originalOffset.y + dPos.y
        });
    }
    onWheel(e: WheelEvent<HTMLDivElement>)
    {
        if (this.props.onWheel)
            this.props.onWheel(e);
        const scaleFactor = this.props.scaleFactor || 1.2;
        let pos = this.mousePosition(vec2(e.clientX, e.clientY));
        let zoom = 1;
        if (e.deltaY < 0)
        {
            zoom = scaleFactor;
        }
        else if (e.deltaY > 0)
        {
            zoom = 1 / scaleFactor;
        }
        this.setState({
            scale: this.state.scale * zoom,
            offsetX: this.state.offsetX - (pos.x * this.state.scale * (zoom - 1)),
            offsetY: this.state.offsetY - (pos.y * this.state.scale * (zoom - 1))
        });
    }
    onScroll(e:UIEvent<HTMLDivElement>)
    {
        this.viewportRef.current!.scrollTo(0, 0);
    }
    render()
    {
        const grabCursor = this.props.grabCursor || "-webkit-grabbing";

        let { className, children, onMouseDown, onMouseUp, onMouseMove, onWheel, style, ...other } = this.props;
        style = style ? style : {};
        style.cursor = this.drag ? grabCursor : "inherit";
        className = className ? [className].concat(["viewport"]).join(" ") : "viewport";

        return (
            <div
                className={className}
                ref={this.viewportRef}
                style={style}
                onMouseDown={(e) => this.onMouseDown(e)}
                onMouseUp={(e) => this.onMouseUp(e)}
                onMouseMove={(e) => this.onMouseMove(e)}
                onWheel={(e) => this.onWheel(e)}
                onScroll={(e)=>this.onScroll(e)}
                {...other}>
                <div
                    className="viewport-wrapper"
                    style={
                        {
                            transformOrigin: "0 0",
                            /*translate: `${this.state.offsetX}px, ${this.state.offsetY}px`,
                            scale: `${this.state.scale}, ${this.state.scale}`*/
                            transform: `translate(${this.state.offsetX}px, ${this.state.offsetY}px) scale(${this.state.scale}, ${this.state.scale})`
                        }}>
                    {
                        children
                    }
                </div>

            </div>
        );
    }
}