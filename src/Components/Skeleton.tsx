import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { traverse } from "./../Utility"

export interface SkeletonProps {
    skeleton: THREE.Skeleton
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
    skeleton: null,
    skeletonToBone: {}
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
        
        if (this._object) {
            const transform = new THREE.Matrix4()

            const boneObject = new THREE.Object3D()


            let currentBone = this.props.skeleton.bones[0]
            let hierarchyup = []
            let parent = currentBone.parent
            while (parent) {
                hierarchyup.push(parent)
               parent = parent.parent 
            }            

            const secondToLastParent = hierarchyup[hierarchyup.length - 2]
             
            boneObject.add(secondToLastParent)

            traverse(secondToLastParent as any, (t: any) => {
                if (t.type !== "Bone") {
                t.visible = false
                }
            })

            // Dirty hack.... 
            // let root: any =null
            // this.props.skeleton.bones.forEach((b) => {
            //     if (b.parent.type !== "Bone") {
            //         // root = b.parent.parent
            //        boneObject.add(b.parent.parent) 
            //         root = b.parent.parent
            //     }
            // })

            // const helperObject: any = {
            //     matrixWorld: new THREE.Matrix4(),
            //     children: [b.parent]
            // }

            this._updateBoneDictionary()
            this.setState({
                skeletonToBone: this._boneDictionary
            })

            let anim = 0
            window.setInterval(() => {
                anim += 0.01
                this._updateBonesFromAnimationClip(anim)
            }, 10)

            // this._object.rotateZ(Math.PI / 2)
            // this._object.position.set(0, -100, 0)
            this._object.add(boneObject)
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

        traverse(this.props.skeleton.bones, (bone) => {
            this._boneDictionary[bone.name] = bone

            if (bone.type !== "Bone") {
                bone.visible = false
            }
        })
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

            if (!resolvedBone) {
                continue
            }

            switch (type) {
                case "scale":
                    // resolvedBone.scale.set(val[0], val[1], val[2])
                    break
                case "position":
                    // resolvedBone.position.set(val[0], val[1] - 100, val[2])

                    break
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

