# outrun-renderer-3d

Renderer strategy for 3d

## Motivation

Front-end / web development has radically changed with the advent of React and similiar technologies. These frameworks allow for easily componentizing code, sharing components, and testing them.

On of the most powerful ideas behind React is the idea that your UI is a _pure function_ of your application state. Often, managing the 'stateful'-ness and the state transitions is where the warts of UI code pop up - and React lets us sidestep those problems, because it takes care of that 'stateful' heavy lifting behind the scenes, and lets us express our web application as a function of state => graphics.

This idea also comes up in the form of 2D UI, in the form of immediate-mode UIs. In the 3D space, though, the APIs tend to be a retained-mode form.

What if we could expose this same idea of _pure function_ for 3D Graphics?

## Sample

```
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Renderer, Camera, Transform, TerrainMesh, Mesh, AmbientLight, Vector3 } from "outrun-renderer-3d"

const cameraPosition = Vector3.create(0, 2, 2)
const lookAtPosition = Vector3.create(0, 0, 0)

const flatTerrain = TerrainMesh.fromHeightFunction(32, 32, Vector2.create(-16, -16), (x, z) => 0)

const MyView = () => {
return <Renderer width={800} height={600}>
        <Camera position={cameraPosition} lookAt={lookAtPosition} fov={70} aspectRatio={800 / 600} near={0.1} far={500}>
            <AmbientLight color={0xFFFFFF} />
            <Material material={{type: "normal"}}>
                <Mesh mesh={flatTerrain} />
            </Material>
        </Camera>
      </Renderer>
}

ReactDOM.render(<MyView />, document.body)
```

## Prior Works

This project was inspired by several other projects:

- [React 360](https://facebook.github.io/react-360/) by Facebook
- [react-three-renderer](https://github.com/toxicFork/react-three-renderer) by toxicFork
- [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber) by micalochman

And is built on the excellent [ThreeJS](https://threejs.org) library by mrdoob

## License

Copyright 2018 Outrun Labs, LLC.

outrun-renderer-3d is licensed under the [GPL v3.0](./LICENSE), intended for educational and non-commercial use.

For commercial use, we have alternative licenses available. Contact license@outrunlabs.com for more information.
