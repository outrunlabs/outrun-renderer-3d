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

        const xScaleFactor = this.props.size.x / this.props.divisions.x
        const yScaleFactor = this.props.size.y / this.props.divisions.y

        let vertices: any[] = []
        let normals: any[] = []
        let uv: any[] = []

        const getNormalForPosition = (x: number, z: number): Vector3 => {
            
            const hL = this.props.getHeight(x - xScaleFactor, z)
            const hR = this.props.getHeight(x + xScaleFactor, z)
            const hD = this.props.getHeight(x, z - yScaleFactor)
            const hU = this.props.getHeight(x, z + yScaleFactor)

            const v =  Vector3.create(hL - hR, 2, hD - hU)
            return Vector3.normalize(v)
        }
        
        let startX, startZ = 0
        if (this.props.position) {
            startX = this.props.position.x
            startZ = this.props.position.y
        }

        for (let x = 0; x < this.props.divisions.x; x++) {
            for (let y = 0; y < this.props.divisions.y; y++) {
                
                const adjX = startX + x * xScaleFactor
                const adjZ = startZ + y * yScaleFactor
                
                const v1 = Vector3.create(adjX, this.props.getHeight(adjX, adjZ), adjZ)
                const v2 = Vector3.create(adjX + xScaleFactor, this.props.getHeight(adjX + xScaleFactor, adjZ), adjZ)
                const v3 = Vector3.create(adjX + xScaleFactor, this.props.getHeight(adjX + xScaleFactor, adjZ + yScaleFactor), adjZ + yScaleFactor)
                const v4 = Vector3.create(adjX, this.props.getHeight(adjX, adjZ + yScaleFactor), adjZ + yScaleFactor)

                const v1Normal = getNormalForPosition(adjX, adjZ)
                const v2Normal = getNormalForPosition(adjX + xScaleFactor, adjZ)
                const v3Normal = getNormalForPosition(adjX + xScaleFactor, adjZ + yScaleFactor)
                const v4Normal = getNormalForPosition(adjX, adjZ + yScaleFactor)

                vertices = [...vertices,
                    v1.x, v1.y, v1.z,
                    v4.x, v4.y, v4.z,
                    v3.x, v3.y, v3.z,
                    v1.x, v1.y, v1.z,
                    v3.x, v3.y, v3.z,
                    v2.x, v2.y, v2.z
                ]

                normals = [...normals,
                    v1Normal.x, v1Normal.y, v1Normal.z,
                    v4Normal.x, v4Normal.y, v4Normal.z,
                    v3Normal.x, v3Normal.y, v3Normal.z,
                    v1Normal.x, v1Normal.y, v1Normal.z,
                    v3Normal.x, v3Normal.y, v3Normal.z,
                    v2Normal.x, v2Normal.y, v2Normal.z
                ]
                
                uv = [...uv,
                    0, 0,
                    0, 1,
                    1, 1,
                    0, 0,
                    1, 1,
                    1, 0
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
            }, {
                name: "normal",
                size: 3,
            }, {
                name: "uv",
                size: 2,
            }],
            vertexData: {
                "position": new Float32Array(vertices),
                "normal": new Float32Array(normals),
                "uv": new Float32Array(uv),
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
