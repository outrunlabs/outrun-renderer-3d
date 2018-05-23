/**
 * Scene.tsx
 *
 * Scene is the top-level component for a scene
 */

import * as React from "react"

import * as THREE from "three"

import { Vector3 } from "./Vector"

import { Renderer3dReconciler } from "./Renderer3dReconciler"
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
                return <InnerCamera {...this.props} registerSceneAndCamera={state.registerSceneAndCamera} notifyUpdate={state.notifyUpdate}>
                    {this.props.children}
                </InnerCamera>
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

    public componentDidMount(): void {
            this._scene = new THREE.Scene()
        // this._scene.background = new THREE.Color(0xFF0000)


            this._camera = new THREE.PerspectiveCamera(this.props.fov || DEFAULT_FOV, this.props.aspectRatio || 1, this.props.near, this.props.far)
            this._camera.position.set(this.props.position.x, this.props.position.y, this.props.position.z)
            this._camera.lookAt(new THREE.Vector3(this.props.lookAt.x, this.props.lookAt.y, this.props.lookAt.z))

            // const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
            // const material = new THREE.MeshNormalMaterial()

            // const mesh = new THREE.Mesh(geometry, material)
            // this._scene.add(mesh)

        this.props.registerSceneAndCamera({
            camera: this._camera,
            scene: this._scene,
        })

            // this._renderer = new THREE.WebGLRenderer({ antialias: true})
            // this._renderer.setSize(width, height)
            // // this._containerElement.appendChild(this._renderer.domElement)

        const {children} = this.props
            this._mountNode = Renderer3dReconciler.createContainer(this._scene)
            Renderer3dReconciler.updateContainer(children, this._mountNode, this)
    }

    public componentDidUpdate(prevProps, prevState) {
        console.warn("componentDidUpdate")

        this._camera.fov = this.props.fov
        this._camera.aspect  = this.props.aspectRatio
        this._camera.updateProjectionMatrix()

        if (this.props.position !== prevProps.position) {
            this._camera.position.set(this.props.position.x, this.props.position.y, this.props.position.z)
        }

        if (this.props.lookAt !== prevProps.lookAt) {
            this._camera.lookAt(new THREE.Vector3(this.props.lookAt.x, this.props.lookAt.y, this.props.lookAt.z))
        }

        this.props.notifyUpdate()

        Renderer3dReconciler.updateContainer(this.props.children, this._mountNode, this)

    }

    public render(): JSX.Element {
        return null
    }

}


