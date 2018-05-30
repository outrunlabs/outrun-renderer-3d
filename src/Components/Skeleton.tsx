import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

export interface SkeletonProps {
    skeleton: THREE.Skeleton
    showSkeleton: boolean
}

export interface SkeletonContextState {
    skeleton: THREE.Skeleton | null
}

export const SkeletonContext = React.createContext<SkeletonContextState>({
    skeleton: null
})

export class Skeleton extends React.PureComponent<SkeletonProps, {}> {

    private _object: THREE.Object3D

    public componentDidMount(): void {
        
        if (this._object && this.props.showSkeleton) {
            const transform = new THREE.Matrix4()
            const obj = {
                matrixWorld: new THREE.Matrix4(),
                children: this.props.skeleton.bones,
            }
            const helper = new THREE.SkeletonHelper(obj as any)
            this._object.scale.set(0.02, 0.02, 0.02)
            this._object.add(helper)
        }
    }

    public render(): JSX.Element {

        return <SkeletonContext.Provider value={{skeleton: this.props.skeleton}}>
                <Object3D ref={(obj) => this._object = obj }>
                {this.props.children}
                </Object3D>
            </SkeletonContext.Provider>
    }
}

