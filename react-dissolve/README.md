# React Dissolve

A color and image animated dissolve effect. (❁´◡`❁)

If you like my work, please buy me a coffee. []\~(￣▽￣)\~*

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jackszeto)

## Live demo

Check out the [Codesandbox live demo](https://codesandbox.io/s/react-dissolve-live-demo-4xyu6?file=/src/App.tsx)

## Installation

Download it with `npm`

```
npm i react-dissolve
```

## How to use

Import it to anywhere in your project.

```ts
import DissolveEffect from "react-dissolve";
```

```tsx
<DissolveEffect
 width={500}
 height={500}
 color={"#40DECF"}
 style={{
 maxWidth: "100%",
 }}
/>
```

And BOOM! 🌟🌟🌟

![dissolve effect](dissolve-effect.gif)

Image is supported now!

![image dissolve effect](dissolve-effect-2.gif)

## Props 🍞

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| animate | `always`\|`hover`\|`none` | `always` | When to animate |
| animateMobile | `always`\|`hover`\|`none` | `none` | | The same as `animate` but only apply on mobile devices |
| breakpoint | number | `768` | The breackpoint(in px) for mobile |
| className | string | `undefined` | Class name |
| src | string | `underfined` | Specifies the path to the image |
| color | string | `#40DECF` | The color of the effect |
| debug | boolean | `false` | Debug mode will show some indicators of the effect |
| fade.innerEffect | boolean | `false` | Apply the dissolve effect within the inner circle |
| fade.innerEdge | number | `0` | A inner circle where the dissolve effect start to fade |
| fade.outerEdge | number | `1` | A outer circle where the dissolve effect end |
| fade.offset | `{x: number, y: number}` | `{x: 0, y: 0}` | Offset of the center |
| fade.ease | `linear`\|`easeIn`\|`easeOut`\|`easeInOut` | `linear` | Ease the fading |
| frameRate | number | `30` | Frame rate of the effect\n can only update it on start |
| handle | boolean | `false` | Toggle the handle so you can change most of the value runtime |
| height | number | `undefined` (required) | The height of the canvas |
| softenShape | boolean | `false` | Soften the shape of the effect |
| style | React.CSSProperties | `undefined` | CSS Properties |
| threshold | number | `0.5` | Threshold of the dissolve effect |
| width | number | `undefined` (required) | The widht of the canvas |
| zoom | number | `40` | Zoom in/out to scale up/down the shape |
