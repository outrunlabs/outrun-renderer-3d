/**
 * Scene.tsx
 *
 * Scene is the top-level component for a scene
 */

import * as React from "react"

import * as THREE from "three"

import { Renderer3dReconciler } from "./Renderer3dReconciler"

export type Color = number

export interface SceneProps {
    width: number
    height: number
}

export type SceneAndCamera = {
    scene: THREE.Scene
    camera: THREE.Camera
}

export type DisposeFunction = () => void
export type NotifyFunction = () => void
export type RegisterSceneAndCameraFunction = (sceneAndCamera: SceneAndCamera) => DisposeFunction

import { Vector3 } from "./Vector"

export interface SceneContextStore {
    registerSceneAndCamera: RegisterSceneAndCameraFunction
    notifyUpdate: NotifyFunction
}

export interface BoxProps {
    position: Vector3
    children?: any
}

export const Box = (props: BoxProps): JSX.Element => { return React.createElement("Box", props, props.children )}

export interface AmbientLightProps {
    color: number 
}

export const AmbientLight = (props: AmbientLightProps): JSX.Element => { return React.createElement("AmbientLight", props)}

export interface PointLightProps {
    color: number
    position: Vector3
    intensity: number
    decay: number
}

export const PointLight = (props: PointLightProps): JSX.Element => { return React.createElement("PointLight", props)}

export interface PlaneProps {
    
}

export const Plane = (props: PlaneProps): JSX.Element => { return React.createElement("Plane", props)}

export interface SceneState {
    sceneAndCameras: SceneAndCamera[]
}

export const SceneContext = React.createContext<SceneContextStore>({
    registerSceneAndCamera: () => { return null },
    notifyUpdate: () => { }
})

export class Scene extends React.PureComponent<SceneProps, SceneState> {
    private _mountNode: HTMLElement

    private _containerElement: HTMLElement
    private _renderer: THREE.WebGLRenderer
    // private _scene: THREE.Scene
    // private _camera: THREE.Camera

    constructor(props: SceneProps) {
        super(props) 

        this.state = {
            sceneAndCameras: []
        }
    }

    public componentDidMount(): void {
        const { children, width, height } = this.props
        if (this._containerElement) {

            // this._camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
            // this._camera.position.set(0, 2, 6)
            // this._camera.lookAt(new THREE.Vector3())

            // this._scene = new THREE.Scene()
            // this._scene.background = new THREE.Color(0x6495ed)

//             const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
//             const material = new THREE.MeshNormalMaterial()

//             const mesh = new THREE.Mesh(geometry, material)
//             scene.add(mesh)

            this._renderer = new THREE.WebGLRenderer({ antialias: true})
            this._renderer.shadowMap.enabled = true
            this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
            this._renderer.setSize(width, height)
            this._containerElement.appendChild(this._renderer.domElement)

            // this._mountNode = Renderer3dReconciler.createContainer(this._scene)
            // Renderer3dReconciler.updateContainer(children, this._mountNode, this)
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        console.warn("componentDidUpdate")

        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this._renderer.setSize(this.props.width, this.props.height)
        }

        // Renderer3dReconciler.updateContainer(this.props.children, this._mountNode, this)

        this._renderScene()

        // this._renderer.render(this._scene, this._camera)
    }

    public render(): JSX.Element {
        return <SceneContext.Provider value={{
            notifyUpdate: () => this._renderScene(),
            registerSceneAndCamera: (sc: SceneAndCamera) => this._registerSceneAndCamera(sc),
        }}>
                <div ref={ref => {this._containerElement = ref}} style={{overflow: "hidden"}}>
                    {this.props.children}
                </div>
            </SceneContext.Provider>
    }

     private _registerSceneAndCamera(sceneAndCamera: SceneAndCamera): DisposeFunction {
        const updatedSceneAndCameras = [...this.state.sceneAndCameras, sceneAndCamera]
        this.setState({
            sceneAndCameras: updatedSceneAndCameras
        })

        return () => {
            const filteredSceneAndCameras = this.state.sceneAndCameras.filter((f) => f !== sceneAndCamera)
        }
    }

    private _renderScene(): void {
        this.state.sceneAndCameras.forEach((sc) => {
            this._renderer.render(sc.scene, sc.camera)
        })
    }
}

