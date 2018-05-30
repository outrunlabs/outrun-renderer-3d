import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

export type Object3dCallback = (ref: THREE.Object3D) => void

export interface Object3dProps {
    ref: Object3dCallback
}

export const Object3D = ("Object3d" as any)
