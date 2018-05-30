/**
 * Scene.tsx
 *
 * Scene is the top-level component for a scene
 */

import * as React from "react"

import * as THREE from "three"

export type Color = number

import { Vector3 } from "./Vector"


export type SceneAndCamera = {
    scene: THREE.Scene
    camera: THREE.Camera
}

export type DisposeFunction = () => void
export type NotifyFunction = () => void
export type RegisterSceneAndCameraFunction = (sceneAndCamera: SceneAndCamera) => DisposeFunction

export interface SceneContextStore {
    registerSceneAndCamera: RegisterSceneAndCameraFunction
    notifyUpdate: NotifyFunction
}

export const SceneContext = React.createContext<SceneContextStore>({
    registerSceneAndCamera: () => { return null },
    notifyUpdate: () => { }
})

export namespace Components {

export interface SceneProps {
    width: number
    height: number
}

export interface SceneState {
    sceneAndCameras: SceneAndCamera[]
}

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

            this._renderer = new THREE.WebGLRenderer({ antialias: true})
            this._renderer.shadowMap.enabled = true
            this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
            this._renderer.setSize(width, height)
            this._containerElement.appendChild(this._renderer.domElement)
        }
    }

    public componentDidUpdate(prevProps, prevState) {

        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this._renderer.setSize(this.props.width, this.props.height)
        }

        this._renderScene()
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

}
