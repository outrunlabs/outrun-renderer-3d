import * as React from "react"
import { Vector3, Vector2 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

export interface GridProps {
    size?: number
    divisions?: number
    colorCenterLine?: number
    colorGrid?: number
}

const DefaultProps: GridProps = {
    size: 10,
    divisions: 10,
    colorCenterLine: 0x444444,
    colorGrid: 0x888888,
}

export class Grid extends React.PureComponent<GridProps, {}> {
    private _object: THREE.Object3D
    private _grid: THREE.GridHelper

    public componentDidMount(): void {
        if (this._object) {
            const fullProps = {
                ...DefaultProps,
                ...this.props,
            }
            this._grid = new THREE.GridHelper(
                fullProps.size,
                fullProps.divisions,
                fullProps.colorCenterLine,
                fullProps.colorGrid,
            )
            this._object.add(this._grid)
        }
    }

    public componentWillUnmount(): void {
        if (this._object && this._grid) {
            this._object.remove(this._grid)
        }
    }

    public render(): JSX.Element {
        return <Object3D ref={obj => (this._object = obj)} />
    }
}
