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
import ViewPort from "../";

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