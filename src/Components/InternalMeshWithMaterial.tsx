import * as React from "react"

import * as THREE from "three"

import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"
import { MaterialInfo } from "./../Material"

import { Object3D } from "./Object3D"

export interface InternalMeshWithMaterialProps {
    mesh: Mesh
    material: MaterialInfo
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
    // bufferGeometry.computeVertexNormals()
    bufferGeometry.computeBoundingBox()
    bufferGeometry.computeBoundingSphere()
    return bufferGeometry
}

const createMaterialFromInfo = (material: MaterialInfo): any => {
    switch (material.type) {
        case "basic":
            return new THREE.MeshBasicMaterial({color: material.color})
        case "normal":
            return new THREE.MeshNormalMaterial()
        case "standard":
            return new THREE.MeshStandardMaterial({
                map: material.diffuseMap ? material.diffuseMap.raw : null,
                normalMap: material.normalMap ? material.normalMap.raw : null,
                emissiveMap: material.emissiveMap ? material.emissiveMap.raw : null,
                emissiveIntensity: material.emissiveIntensity || 0,
                color: 0xFFFFFF,
            })
        case "phong":
            return new THREE.MeshPhongMaterial({
                map: material.diffuseMap ? material.diffuseMap.raw : null,
                normalMap: material.normalMap ? material.normalMap.raw : null,
                emissiveMap: material.emissiveMap ? material.emissiveMap.raw : null,
                specularMap: material.specularMap ? material.specularMap.raw : null,
                emissiveIntensity: material.emissiveIntensity || 0,
                color: 0xFFFFFF,
                
            })
        // default:
        //     throw new Error("Unknown material type: " + material.type)
    }
}

export class InternalMeshWithMaterial extends React.PureComponent<InternalMeshWithMaterialProps, {}> {

    private _parentObject: THREE.Object3D
    private _meshObject: THREE.Object3D
    
    public componentDidMount(): void {

        if (this._parentObject) {
            const geometry = createBufferGeometryFromMesh(this.props.mesh)
            const material = createMaterialFromInfo(this.props.material)

            let mesh: THREE.Mesh | THREE.SkinnedMesh = null
            if (this.props.skeleton && this.props.mesh.vertexData["skinWeight"] && this.props.mesh.vertexData["skinIndex"]) {
                material.skinning = true
                let skinnedmesh = new THREE.SkinnedMesh(geometry, material)
                // skinnedmesh.matrix = (this.props.mesh as any).matrix
                const bindMatrix = (this.props.mesh as any).bindMatrix
                skinnedmesh.bind(this.props.skeleton, bindMatrix)

                window["bindMatrix"] = bindMatrix
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

