import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

export interface PlaneProps {
   position?: Vector3 
}

export class Plane extends React.PureComponent<PlaneProps, {}> {
    
    private _object: THREE.Object3D

    public componentDidMount(): void {
        if (this._object) {
                   const planeGeometry = new THREE.PlaneGeometry(500, 500, 1, 1)
        const mesh2 = new THREE.Mesh(
          planeGeometry,
          new THREE.MeshPhongMaterial({ color: 0x090909 })
        )
        mesh2.rotateX(-Math.PI / 2)
        mesh2.position.set(0, -1, 0)
        mesh2.updateMatrix()
        mesh2.receiveShadow = true
            this._object.add(mesh2)
        
        }
    }

    public render(): JSX.Element {
        return <Object3D ref={(obj) => this._object = obj} />
    }
}

