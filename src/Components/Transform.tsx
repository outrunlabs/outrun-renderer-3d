import * as React from "react"
import * as THREE from "three"
import { Vector3 } from "./../Vector"
import { Quaternion } from "./../Quaternion"
import { Mesh } from "./../Model"

import { Object3D } from "./Object3D"
export type Radians = number

export type Transforms = {
    translate: Vector3
} | {
    quaternion: Quaternion
} | {
    rotateX: Radians
} | {
    rotateY: Radians
} | {
    rotateZ: Radians
} | {
    scale: number
}

const IdentityMatrix = new THREE.Matrix4()
const EmptyTransforms: Transforms[] = []

export type ReferenceFunction = (ref: THREE.Object3D) => void

export interface TransformProps {
    
    transform?: Transforms[]
    objectRef?: ReferenceFunction
}

const isNumber = (obj: any) => typeof obj === "number"

const applyTransformToObject = (obj: THREE.Object3D, transform: any): void => {
    if (transform.translate) {
        obj.position.set(transform.translate.x, transform.translate.y, transform.translate.z)
    } else if (isNumber(transform.rotateX)) {
        obj.rotateX(transform.rotateX)
    } else if (isNumber(transform.rotateY)) {
        obj.rotateY(transform.rotateY)
    } else if(isNumber(transform.rotateZ)) {
        obj.rotateZ(transform.rotateZ)
    } else if (isNumber(transform.scale)) {
        obj.scale.setScalar(transform.scale)
    } else if (transform.quaternion) {
        obj.quaternion.set(transform.quaternion.x, transform.quaternion.y, transform.quaternion.z, transform.quaternion.w)
    }
}

export class Transform extends React.PureComponent<TransformProps, {}> {
    private _obj: THREE.Object3D

    public componentDidMount(): void {

        if (this.props.objectRef && this._obj) {
            this.props.objectRef(this._obj)
        }

       this._updateTransform() 
    }

    public componentDidUpdate(oldProps: TransformProps): void {
        if (oldProps.transform !== this.props.transform) {
            this._updateTransform()
        }
    }

    public render(): JSX.Element {
        return <Object3D ref={(obj) => this._obj = obj}>
                {this.props.children}
                </Object3D>
    }

    private _updateTransform(): void {
        if (this._obj) {
            this._obj.position.set(0, 0, 0)
            this._obj.rotation.set(0, 0, 0)
            this._obj.scale.setScalar(1)

            if (this.props.transform && this.props.transform) {
                this.props.transform.forEach((t) => applyTransformToObject(this._obj, t))
            }
        }
    }
}

export class Group extends Transform {
    
}

