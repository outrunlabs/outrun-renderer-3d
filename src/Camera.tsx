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

// import { Renderer3dReconciler } from "./Renderer3dReconciler"
import { SceneContext, SceneContextStore, RegisterSceneAndCameraFunction, NotifyFunction, SceneAndCamera, DisposeFunction } from "./Scene"

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
        return <SceneContext.Consumer>{
            ((state: SceneContextStore) => {
                return <InnerCamera {...this.props} registerSceneAndCamera={state.registerSceneAndCamera} notifyUpdate={state.notifyUpdate} />
            })}
            </SceneContext.Consumer>
    }
}

export interface InnerCameraProps extends CameraProps {
    registerSceneAndCamera: RegisterSceneAndCameraFunction
    notifyUpdate: NotifyFunction
}

export class InnerCamera extends React.PureComponent<InnerCameraProps, {}> {
    private _scene: THREE.Scene
    private _camera: THREE.PerspectiveCamera
    private _mountNode: HTMLElement
    private _reconciler: any

    public componentDidMount(): void {
            this._scene = new THREE.Scene()
        
            this._scene.fog = new THREE.Fog(0x000303, 1, 50)


            this._camera = new THREE.PerspectiveCamera(this.props.fov || DEFAULT_FOV, this.props.aspectRatio || 1, this.props.near, this.props.far)
            this._camera.position.set(this.props.position.x, this.props.position.y, this.props.position.z)
            this._camera.lookAt(new THREE.Vector3(this.props.lookAt.x, this.props.lookAt.y, this.props.lookAt.z))


        this.props.registerSceneAndCamera({
            camera: this._camera,
            scene: this._scene,
        })

            const reconcilerCore = new ThreeReconcilerCore()
            this._reconciler = createReconciler<THREE.Object3D>(reconcilerCore)

            const {children} = this.props
            this._mountNode = this._reconciler.createContainer(this._scene)
            this._reconciler.updateContainer(children, this._mountNode, this)
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

        this._reconciler.updateContainer(this.props.children, this._mountNode, this)
        this.props.notifyUpdate()
    }

    public render(): JSX.Element {
        return null
    }

}


