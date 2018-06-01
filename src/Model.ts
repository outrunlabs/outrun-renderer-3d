
import * as THREE from "three"

const FBXLoader = require("three-fbx-loader")
const fbxLoader = new FBXLoader()

const OBJLoader = require("three-obj-loader")
OBJLoader(THREE)

import * as Utility from "./Utility"

import { Material } from "./Material"

export interface MeshVertexAttributeInfo {
    name: string
    size: number
}

export type AttributeToData = {[attributeName: string]: any}

export interface Mesh {
    vertexAttributes: MeshVertexAttributeInfo[]
    vertexData: AttributeToData
}

export interface ModelMesh {
    mesh: Mesh
    material: Material
}

export const convertBufferGeometryToMesh = (bg: any): Mesh => {
    const vertexAttributes = Object.keys(bg.attributes).map((bufferAttributeName) => {
        return {
            name: bufferAttributeName,
            size: bg.attributes[bufferAttributeName].itemSize,
        }
    })

    let data: AttributeToData = {}
    const vertexData = Object.keys(bg.attributes).forEach((name) => {
        data[name] = bg.attributes[name].array
    })

    return {
        vertexAttributes,
        vertexData: data,
    }
}

export namespace Mesh {

    export const fromFile = async (modelPath: string): Promise<Mesh[]> => {
        const ext = Utility.getFileExtension(modelPath.toLowerCase())

        switch(ext) {
            case "obj":
                return await loadMeshFromObj(modelPath)
            default:
                throw new Error("No loader available for: " + ext)
        }
    }

    const loadMeshFromObj = (modelPath: string): Promise<Mesh[]> => {

        const objLoader = new THREE.OBJLoader()

        return new Promise((res, rej) => {

            objLoader.load(modelPath, (group: THREE.Group) => {

                let ret: Mesh[] = []

                group.children.forEach((child: THREE.Mesh) => {
                    if (child.type !== "Mesh") {
                        return
                    }

                    ret.push(convertBufferGeometryToMesh(child.geometry as THREE.BufferGeometry))
                })

                res(ret)
            })
            
        })
        
    }
    
}

// export interface Model {
//     modelMeshes: ModelMesh[]
// }

// export namespace Model {

//     const createFromRaw = (any): Model => ({
//         modelMeshes: [],
//     })

//     export const fromFile = async (modelPath: string): Promise<Model> => {
//         const ext = Utility.getFileExtension(modelPath.toLowerCase())
//         if (ext === "fbx") {
//             return loadFbx(modelPath)     
//         }

//         throw new Error("No runtime loader available for: " + ext)
        
//     }

//     const loadFbx = async (fbxModelPath: string): Promise<Model> => {
//         return new Promise<Model>((res, reject) => {
//             fbxLoader.load(fbxModelPath, (result: any) => {
//                 res(createFromRaw(result))
//             })  
//         })
//     }
    
// }
