import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { traverse } from "./../Utility"

export interface SkeletonProps {
    skeleton: THREE.Skeleton
    showSkeleton: boolean
    animation?: THREE.AnimationClip | null
    animationTime?: number
}

export interface SkeletonState {
    skeletonToBone: any
}

export interface SkeletonContextState {
    skeleton: THREE.Skeleton | null
    skeletonToBone: any
}

export const SkeletonContext = React.createContext<SkeletonContextState>({
    skeleton: null
})

export class Skeleton extends React.PureComponent<SkeletonProps, SkeletonState> {

    private _object: THREE.Object3D
    private _boneDictionary: {[bone: string]: THREE.Bone } = {}

    constructor(props: SkeletonProps) {
        super(props)

        this.state = {
            skeletonToBone: null
        }
    }

    public componentDidMount(): void {
        
        if (this._object && this.props.showSkeleton) {
            const transform = new THREE.Matrix4()
            const obj = {
                matrixWorld: new THREE.Matrix4(),
                children: this.props.skeleton.bones,
            }
            this._updateBoneDictionary()
            this.setState({
                skeletonToBone: this._boneDictionary
            })

            let anim = 0
            window.setInterval(() => {
                anim += 0.1
                this._updateBonesFromAnimationClip(anim)
            }, 100)

            const helper = new THREE.SkeletonHelper(obj as any)
            this._object.scale.set(0.02, 0.02, 0.02)
            this._object.add(helper)
        }
    }

    public componentDidUpdate(): void {
        
    }

    public render(): JSX.Element {

        return <SkeletonContext.Provider value={{skeleton: this.props.skeleton, skeletonToBone: this.state.skeletonToBone}}>
                <Object3D ref={(obj) => this._object = obj }>
                {this.props.children}
                </Object3D>
            </SkeletonContext.Provider>
    }

    private _updateBoneDictionary(): void {
        this._boneDictionary = {}

        traverse(this.props.skeleton.bones, (bone) => this._boneDictionary[bone.name] = bone)
    }

    private _updateBonesFromAnimationClip(time: number): void {
        if (!this.props.animation) {
            return
        }
        
        for (let i = 0; i < this.props.animation.tracks.length; i++) {

            const track = this.props.animation.tracks[i] as any
            const name = track.name
            const [bone, type] = name.split(".")

            const interpolant = track.createInterpolant()
            const resolvedBone = this._boneDictionary[bone]
            const val = interpolant.evaluate(time)

            switch (type) {
                // case "scale":
                // case "position":
                //     // resolvedBone.position.set(val[0], val[1], val[2]);
                //     (resolvedBone as any).updateMatrixWorld()
                //     break
                case "quaternion":
                    resolvedBone.quaternion.set(val[0], val[1], val[2], val[3]);
                    (resolvedBone as any).updateMatrixWorld()
                    break
                default:
                    console.warn("Unknown animation type: " + type)
            }
            
        }

        this.props.skeleton.update()
    }
}

