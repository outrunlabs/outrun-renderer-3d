

import * as THREE from "three"

import { Vector2, Vector3 } from "./Vector"

const FBXLoader = require("three-fbx-loader")
const fbxLoader = new FBXLoader()


import { Mesh, convertBufferGeometryToMesh } from "./Model"

import * as Utility from "./Utility"

export namespace TerrainMesh {

    export const fromHeightFunction = (size: number, divisions: number, position: Vector2, getHeight: (x: number, z: number) => number): Mesh => {
        const xScaleFactor = size / divisions
        const yScaleFactor = size / divisions

        let vertices: any[] = []
        let normals: any[] = []
        let uv: any[] = []

        const getNormalForPosition = (x: number, z: number): Vector3 => {
            
            const hL = getHeight(x - xScaleFactor, z)
            const hR = getHeight(x + xScaleFactor, z)
            const hD = getHeight(x, z - yScaleFactor)
            const hU = getHeight(x, z + yScaleFactor)

            const v =  Vector3.create(hL - hR, 2, hD - hU)
            return Vector3.normalize(v)
        }
        
        let startX, startZ = 0
        if (position) {
            startX = position.x
            startZ = position.y
        }

        for (let x = 0; x < divisions; x++) {
            for (let y = 0; y < divisions; y++) {
                
                const adjX = startX + x * xScaleFactor
                const adjZ = startZ + y * yScaleFactor
                
                const v1 = Vector3.create(adjX, getHeight(adjX, adjZ), adjZ)
                const v2 = Vector3.create(adjX + xScaleFactor, getHeight(adjX + xScaleFactor, adjZ), adjZ)
                const v3 = Vector3.create(adjX + xScaleFactor, getHeight(adjX + xScaleFactor, adjZ + yScaleFactor), adjZ + yScaleFactor)
                const v4 = Vector3.create(adjX, getHeight(adjX, adjZ + yScaleFactor), adjZ + yScaleFactor)

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

        return mesh
    }
}
