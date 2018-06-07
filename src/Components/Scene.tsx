import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

export type SceneCallback = (ref: THREE.Scene) => void

export interface SceneProps {
    ref: SceneCallback
}

export const Scene = ("Scene" as any)
