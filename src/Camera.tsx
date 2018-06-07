/**
 * Scene.tsx
 *
 * Scene is the top-level component for a scene
 */

import * as React from "react"

import * as THREE from "three"

import { Vector3 } from "./Vector"

import { createReconciler, ThreeReconcilerCore } from "./Reconciler"
import { Components } from "./Components"
import { Scene } from "./Components/Scene"

// import { Renderer3dReconciler } from "./Renderer3dReconciler"
import { NotifyFunction, SceneAndCamera, DisposeFunction } from "./Scene"

const DEFAULT_FOV = 70

export interface CameraProps {
    position: Vector3 
    lookAt: Vector3
    fov?: number
    aspectRatio: number
    near: number
    far: number
}

export class Camera extends React.PureComponent<CameraProps, {}> {
    public render(): JSX.Element {
            return <InnerCamera {...this.props} />
    }
}


export class InnerCamera extends React.PureComponent<CameraProps, {}> {
    private _scene: THREE.Scene
    private _camera: THREE.PerspectiveCamera

    public componentDidMount(): void {
        if (this._scene) {
        
            this._scene.fog = new THREE.Fog(0x000303, 1, 50)

            this._camera = new THREE.PerspectiveCamera(this.props.fov || DEFAULT_FOV, this.props.aspectRatio || 1, this.props.near, this.props.far)
            this._camera.position.set(this.props.position.x, this.props.position.y, this.props.position.z)
            this._camera.lookAt(new THREE.Vector3(this.props.lookAt.x, this.props.lookAt.y, this.props.lookAt.z))

            this._scene.userData = this._camera
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        this._camera.fov = this.props.fov
        this._camera.aspect  = this.props.aspectRatio
        this._camera.updateProjectionMatrix()

        if (this.props.position !== prevProps.position) {
            this._camera.position.set(this.props.position.x, this.props.position.y, this.props.position.z)
        }

        if (this.props.lookAt !== prevProps.lookAt) {
            this._camera.lookAt(new THREE.Vector3(this.props.lookAt.x, this.props.lookAt.y, this.props.lookAt.z))
        }
    }

    public render(): JSX.Element {
        return <Scene ref={(scene) => this._scene = scene}>
            {this.props.children}
        </Scene>
    }

}


