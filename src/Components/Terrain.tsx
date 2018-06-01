import * as React from "react"
import { Vector3, Vector2 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { SkeletonContext } from "./Skeleton"

import { Mesh as MeshComponent } from "./Mesh"

export type TerrainHeightFunction = (x: number, z: number) => number

export interface TerrainProps {
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

        const xScaleFactor = this.props.size.x / this.props.divisions.x
        const yScaleFactor = this.props.size.y / this.props.divisions.y

        let vertices: any[] = []

        for (let x = 0; x < this.props.divisions.x; x++) {
            for (let y = 0; y < this.props.divisions.y; y++) {
                
                const adjX = x * xScaleFactor
                const adjZ = y * xScaleFactor
                
                const v1 = Vector3.create(adjX, this.props.getHeight(adjX, adjZ), adjZ)
                const v2 = Vector3.create(adjX + xScaleFactor, this.props.getHeight(adjX + xScaleFactor, adjZ), adjZ)
                const v3 = Vector3.create(adjX + xScaleFactor, this.props.getHeight(adjX + xScaleFactor, adjZ + yScaleFactor), adjZ + yScaleFactor)
                const v4 = Vector3.create(adjX, this.props.getHeight(adjX, adjZ + yScaleFactor), adjZ + yScaleFactor)

                vertices = [...vertices,
                    v1.x, v1.y, v1.z,
                    v4.x, v4.y, v4.z,
                    v3.x, v3.y, v3.z,
                    v1.x, v1.y, v1.z,
                    v3.x, v3.y, v3.z,
                    v2.x, v2.y, v2.z
                ]
            }
        }
	// -1.0, 0,  -1.0,
	 // 1.0, 0,  -1.0,
	 // 1.0,  0,  1.0,

	 // 1.0,  0.0,  1.0,
	// -1.0,  0.0,  1.0,
	// -1.0, 0.0,  -1.0
// ] );
        const mesh: Mesh = {
            vertexAttributes: [{
                name: "position",
                size: 3,
            }],
            vertexData: {
                "position": new Float32Array(vertices),
            }
        }

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
