A drag and zoom supported viewport. 

Using CSS transform. 

## Installation

```shell
npm install --save react-free-viewport
```

## Usage

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import ViewPort from "react-free-viewport";

const element = (
    <div>
        <ViewPort id="view-port">
            <div>
                Hello World!
            </div>
        </ViewPort>
    </div>
);
const $ = selector => document.querySelector(selector);

ReactDOM.render(element, $("#root"));
```

```css
#view-port{
    font-size: 24pt;
    padding: 20px;
    width: 400px;
    height: 300px;
    overflow: hidden;
}
```

**DEMO**

![](https://cdn-img.sardinefish.com/NTk5NDM5)


## Documentation

### Props
| Name          | Type      | Default   | Description   |
| ------------- | --------- | --------- | ------------- |
| button        | number    | `0`       | Indicate which mouse button can be used to drag. `0`: left, `1`: mid, `2`: right
| scaleFactor   | number    | `1.2`     | The scale factor when the mouse wheel scroll up. If the value is less then 1, the viewport will zoom out when scroll up, and zoom in when scroll down.
| grabCursor    | string    | `"-webkit-grabbing"`  | The CSS cursor property value while dragging.

