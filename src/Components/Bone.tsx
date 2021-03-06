import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { SkeletonContext } from "./Skeleton"

export interface BoneProps {
    boneName: string
}

export class Bone extends React.PureComponent<BoneProps, {}> {

    public render(): JSX.Element {

        return <SkeletonContext.Consumer>{(args) => {

            if (!args.skeletonToBone) {
                return null
            }

            return <InnerBone bone={args.skeletonToBone[this.props.boneName]}>
                {this.props.children}
            </InnerBone>
        }}
        </SkeletonContext.Consumer>
    }
}

export interface InnerBoneProps {
    bone: THREE.Bone
}

export class InnerBone extends React.PureComponent<InnerBoneProps, {}> {
    private _object: THREE.Object3D

    public componentDidMount(): void {
        
        if (this._object && this.props.bone) {

            this.props.bone.add(this._object)

            const bone: THREE.Bone = this.props.bone

            window.setInterval(() => {
                
            const pos = new THREE.Vector3().setFromMatrixPosition(bone.matrixWorld)
            const quat = new THREE.Quaternion().setFromRotationMatrix(bone.matrixWorld)
            // const scale = new THREE.Vector3().setFromMatrixScale(bone.matrixWorld)

            const matrix = new THREE.Matrix4()
                matrix.setPosition(pos);
                matrix.makeRotationFromQuaternion(quat);

            if (bone && this._object) {
                
                this._object.matrix = matrix
            }

            }, 10)
        }
    }

    public render(): JSX.Element {
            return <Object3D ref={(obj) => this._object = obj}>
                {this.props.children}
            </Object3D>
    }
}

