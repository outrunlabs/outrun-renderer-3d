import * as React from "react"

import * as THREE from "three"

import { Vector3 } from "./../../Vector"
import { Mesh } from "./../../Model"
import { MaterialInfo } from "./../../Material"

import { Object3D } from "./../Object3D"

import { ThreeMaterialContext } from "./ThreeMaterialContext"

export interface InternalMeshWithMaterialProps {
    mesh: Mesh
    material: THREE.Material
    skeleton: THREE.Skeleton
}

const createBufferGeometryFromMesh = (mesh: Mesh): THREE.BufferGeometry => {
    const bufferGeometry = new THREE.BufferGeometry()

    if (mesh) {
        mesh.vertexAttributes.forEach((va) => {
            const vertexData = mesh.vertexData[va.name]
            bufferGeometry.addAttribute(va.name, new THREE.BufferAttribute(vertexData, va.size))
        }) 
    }
    bufferGeometry.computeBoundingBox()
    bufferGeometry.computeBoundingSphere()
    return bufferGeometry
}

export class ThreeMeshWithMaterial extends React.PureComponent<InternalMeshWithMaterialProps, {}> {

    private _parentObject: THREE.Object3D
    private _meshObject: THREE.Object3D
    
    public componentDidMount(): void {

        if (this._parentObject) {
            const geometry = createBufferGeometryFromMesh(this.props.mesh)
            const material = this.props.material as any

            let mesh: THREE.Mesh | THREE.SkinnedMesh = null
            if (this.props.skeleton && this.props.mesh.vertexData["skinWeight"] && this.props.mesh.vertexData["skinIndex"]) {
                material.skinning = true
                let skinnedmesh = new THREE.SkinnedMesh(geometry, material)
                // skinnedmesh.matrix = (this.props.mesh as any).matrix
                const bindMatrix = (this.props.mesh as any).bindMatrix
                skinnedmesh.bind(this.props.skeleton, bindMatrix)

                // skinnedmesh.scale.set(100, 100, 100)
                // skinnedmesh.updateMatrixWorld()

                // skinnedmesh.matrixAutoUpdate = true
                
                // skinnedmesh.position.set(0, -200, 0)
                // skinnedmesh.updateMatrixWorld()
                skinnedmesh.frustumCulled = false
                mesh = skinnedmesh
            } else {
               mesh = new THREE.Mesh(geometry, material) 
            }
            mesh.castShadow = true
            this._parentObject.add(mesh)
        }
    }

    public render(): JSX.Element {
        return <Object3D ref={(obj) => this._parentObject = obj} />
    }
}

