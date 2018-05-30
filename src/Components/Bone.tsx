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

            return <InnerBone skeleton={args.skeleton} boneName={this.props.boneName}>
                {this.props.children}
            </InnerBone>
        }}
        </SkeletonContext.Consumer>
    }
}

export interface InnerBoneProps {
    boneName: string
    skeleton: THREE.Skeleton
}

export class InnerBone extends React.PureComponent<InnerBoneProps, {}> {
    private _object: THREE.Object3D

    public componentDidMount(): void {
        
        if (this._object && this.props.boneName) {

            const bone: THREE.Bone = this.props.skeleton.bones[0]

            const pos = bone.matrixWorld.getPosition()

            if (bone) {
                this._object.position.set(pos.x, pos.y, pos.z)
                this._object.scale.set(10, 10, 10)
            }
        }
    }

    public render(): JSX.Element {
            return <Object3D ref={(obj) => this._object = obj}>
                {this.props.children}
            </Object3D>
    }
}

