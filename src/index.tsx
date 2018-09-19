import React from "react";
interface Props
{
    children?: React.ReactNode;
    className?: string;
    id?: string;
    key?: any;
}
interface State
{
    offsetX: number;
    offsetY: number;
    zoom: number;
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
    spaceRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props)
    {
        super(props);
        this.state = {
            offsetX: 0,
            offsetY: 0,
            zoom: 1,
            drag: false
        };
        this.spaceRef = React.createRef<HTMLDivElement>();
    }
    mousePosition(clientPos: Vector): Vector
    {
        let element = this.spaceRef.current as HTMLDivElement;
        let rect = element.getBoundingClientRect();
        return {
            x: (clientPos.x - rect.left - this.state.offsetX) / this.state.zoom,
            y: (clientPos.y - rect.top - this.state.offsetY) / this.state.zoom
        };
    }
    onMouseDown(e: MouseEvent)
    {
        if (e.button === 1)
        {
            this.originalOffset = { x: this.state.offsetX, y: this.state.offsetY };
            this.mouseDownPos = { x: e.clientX, y: e.clientY };
            this.drag = true;
            this.setState({ drag: true });
        }
    }
    onMouseUp(e: MouseEvent)
    {
        if (e.button === 1)
        {
            this.drag = false;
            this.setState({ drag: false });
        }
    }
    onMouseMove(e: MouseEvent)
    {
        if (!this.drag)
            return;
        let dPos: Vector = { x: e.clientX - this.mouseDownPos.x, y: e.clientY - this.mouseDownPos.y };
        this.setState({
            offsetX: this.originalOffset.x + dPos.x,
            offsetY: this.originalOffset.y + dPos.y
        });
    }
    onWheel(e: WheelEvent)
    {
        let element = this.spaceRef.current as HTMLDivElement;
        let rect = element.getBoundingClientRect();
        let pos = this.mousePosition(vec2(e.clientX, e.clientY));
        let zoom = this.state.zoom;
        if (e.deltaY < 0)
        {
            zoom *= 1.2;
        }
        else if (e.deltaY > 0)
        {
            zoom /= 1.2;
        }
        let newPos = {
            x: (e.clientX - rect.left - this.state.offsetX) / zoom,
            y: (e.clientY - rect.top - this.state.offsetY) / zoom
        };
        this.setState({
            zoom: zoom,
            offsetX: this.state.offsetX - (pos.x - newPos.x) * zoom,
            offsetY: this.state.offsetY - (pos.y - newPos.y) * zoom
        });
    }
    render()
    {
        return (
            <div
                id={this.props.id}
                className={["viewport"].concat(this.props.className || "").join(" ")}
                ref={this.spaceRef}
                style={{
                    cursor: this.drag ? "-webkit-grabbing" : "default",
                }}
                onMouseDown={(e: any) => this.onMouseDown(e)}
                onMouseUp={(e: any) => this.onMouseUp(e)}
                onMouseMove={(e: any) => this.onMouseMove(e)}
                onWheel={(e: any) => this.onWheel(e)}>
                <div
                    className="viewport-wrapper"
                    style={
                        {
                            transformOrigin: "0 0",
                            transform: `translate(${this.state.offsetX}px, ${this.state.offsetY}px) scale(${this.state.zoom}, ${this.state.zoom})`
                        }}>
                    {
                        this.props.children
                    }
                </div>

            </div>
        );
    }
}