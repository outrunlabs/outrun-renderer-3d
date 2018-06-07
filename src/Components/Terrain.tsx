import * as React from "react"
import { Vector3, Vector2 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { SkeletonContext } from "./Skeleton"

import { Mesh as MeshComponent } from "./Mesh"
import { TerrainMesh } from "./../TerrainMesh"

export type TerrainHeightFunction = (x: number, z: number) => number

export interface TerrainProps {
    position: Vector2
    size: Vector2
    divisions: Vector2

    getHeight: TerrainHeightFunction
}

export interface TerrainState {
    mesh: Mesh | null
}

export class Terrain extends React.PureComponent<TerrainProps, TerrainState> {

    constructor(props: TerrainProps) {
        super(props)

        this.state = {
            mesh: null
        }
    }
    
    public componentDidMount(): void {
        const mesh = TerrainMesh.fromHeightFunction(this.props.size.x, this.props.divisions.x, this.props.position, this.props.getHeight)

        this.setState({
            mesh,
        })
    }

    public render(): JSX.Element {
        if (!this.state.mesh) {
            return null
        }
        return <MeshComponent mesh={this.state.mesh} />
    }
}
