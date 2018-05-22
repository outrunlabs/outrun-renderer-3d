/**
 * Scene.tsx
 *
 * Scene is the top-level component for a scene
 */

import * as React from "react"

import * as THREE from "three"

import { Renderer3dReconciler } from "./Renderer3dReconciler"

const FBXLoader = require("three-fbx-loader")

const loader = new FBXLoader()

export interface SceneProps {
    width: number
    height: number
}

import { TGALoader } from "./TGALoader"

const textureLoader = new THREE.TextureLoader()
const diffuseTexture = textureLoader.load("test-character/hand_t.jpg")

export const Box: React.Component<{}> = "Box" as any
export const AmbientLight: React.Component<{}> = "AmbientLight" as any
export const PointLight: React.Component<{}> = "PointLight" as any
export const Plane: React.Component<{}> = "Plane" as any

export class Scene extends React.PureComponent<SceneProps, {}> {
    private _mountNode: HTMLElement

    private _containerElement: HTMLElement
    private _renderer: THREE.Renderer
    private _scene: THREE.Scene
    private _camera: THREE.Camera
    
    public componentDidMount(): void {
        const { children, width, height } = this.props

        if (this._containerElement) {

            this._camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
            this._camera.position.set(0, 2, 6)
            this._camera.lookAt(new THREE.Vector3())

            this._scene = new THREE.Scene()

//             const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
//             const material = new THREE.MeshNormalMaterial()

//             const mesh = new THREE.Mesh(geometry, material)
//             scene.add(mesh)
            let mixers=[]

            loader.load("test-character/hands-ascii-2013.FBX", (obj: any) => {

                for(let i = 0; i< obj.children.length; i++) {

                    const child = obj.children[i] as any
                    if (child.material) {
                        

                       child.material = new THREE.MeshLambertMaterial({
                           skinning: true,
                           emissive: 0x0F0F0F,
                           color: 0xFFFFFF,
                           map: diffuseTexture,
                       })
                    }
                    
                }

                const mixer = new THREE.AnimationMixer( obj );
                mixers.push(mixer);
                var action = mixer.clipAction( obj.animations[ 0 ] );
                action.play();

                const wrapperObj = new THREE.Object3D()
                wrapperObj.add(obj)
                wrapperObj.scale.set(0.01, 0.01, 0.01)

                this._scene.add(wrapperObj)
                const box = new THREE.Box3().setFromObject(wrapperObj)
                

                const center = new THREE.Vector3(-0.5 * (box.max.x - box.min.x), -0.5 * (box.max.y - box.min.y), -0.5 * (box.max.z - box.min.z))
                wrapperObj.position.set(center.x + 0.7, center.y + 0.5, center.z + 4.2)
                // wrapperObj.rotateY(Math.PI/2)
            })


            this._renderer = new THREE.WebGLRenderer({ antialias: true})
            this._renderer.setSize(width, height)
            this._containerElement.appendChild(this._renderer.domElement)

            window.setInterval(() => {
                    for ( var i = 0; i < mixers.length; i ++ ) {
						mixers[ i ].update(0.01);
					}
            }, 10)

            this._mountNode = Renderer3dReconciler.createContainer(this._scene)
            Renderer3dReconciler.updateContainer(children, this._mountNode, this)
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        console.warn("componentDidUpdate")

        Renderer3dReconciler.updateContainer(this.props.children, this._mountNode, this)

        this._renderer.render(this._scene, this._camera)
    }

    public render(): JSX.Element {
        return <div ref={ref => {this._containerElement = ref}} />
    }
}

