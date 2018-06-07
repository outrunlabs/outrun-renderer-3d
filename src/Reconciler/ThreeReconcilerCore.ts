import { ReconcilerCore } from "./Reconciler"
import * as THREE from "three"

import { Mesh } from "./../Model"

export type Updater = (object: THREE.Object3D, val: any) => void
export type KeyToUpdater = {[key: string]: Updater}

export interface ElementFactory {
    create: (props: any) => JSX.Element,
    update: KeyToUpdater,
}

const BasicMaterialFactory = {
    creator: (props: any) => {
        
    }
}

export type ElementFactories = {[type: string]: ElementFactory}
const Factory = {
}


export class ThreeReconcilerCore implements ReconcilerCore<THREE.Object3D> {
  public appendChild(parent: THREE.Object3D, child: THREE.Object3D): void {
      console.log("appendChild")
    parent.add(child)
  }

  public removeChild(parent: THREE.Object3D, child: THREE.Object3D): void {
      parent.remove(child)
  }

  public createElement(type: string, props: any): THREE.Object3D {

      if (Factory[type] && Factory[type].create) {
        return Factory[type].create(props)
      }
    switch (type) {
      case "AmbientLight":
        const light = new THREE.AmbientLight(props.color)
        return light
      case "PointLight":
        const pointLight = new THREE.PointLight(
          props.color,
          props.intensity,
          props.decay
        )
        pointLight.castShadow = true

        pointLight.shadow.mapSize.width = 512
        pointLight.shadow.mapSize.height = 512

        return pointLight
      case "SpotLight":
        const spotLight = new THREE.SpotLight(props.color)
        // spotLight.position.set(props.position.x, props.position.y, props.position.z)
        spotLight.castShadow = true

        spotLight.distance = 20
        spotLight.decay = 2
        spotLight.angle = Math.PI / 4
        spotLight.penumbra = 0.187

        spotLight.shadow.mapSize.width = 512
        spotLight.shadow.mapSize.height = 512

        spotLight.shadow.camera.near = 0.1
        spotLight.shadow.camera.far = 20
        spotLight.shadow.camera.fov = 45

        const target = new THREE.Object3D()
        target.position.set(props.target.x, props.target.y, props.target.z)
        spotLight.target = target
        return spotLight

      case "Object3d":
            const obj5 = new THREE.Object3D()
            if (props.position) {
                obj5.position.set(props.position.x, props.position.y, props.position.z)
            }
            return obj5
      case "Scene":
            const scene = new THREE.Scene()
            return scene
      case "Group":
        const obj = new THREE.Object3D()
            if (props.position) {
                obj.position.set(props.position.x, props.position.y, props.position.z)
            }
        // obj.position.set(props.position.x,props.position.y, props.position.z)
        return obj
      case "Box":
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        // const material = new THREE.MeshLambertMaterial()
        // const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: diffuseTexture }
        const mesh3 = new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff })
        )
        mesh3.receiveShadow = false
        mesh3.castShadow = true

        mesh3.position.set(props.position.x, props.position.y, props.position.z)
        mesh3.updateMatrix()
        return mesh3
      default:
        throw new Error("Unknown element: " + type)
    }
  }

  public updateElement(
    instance: any,
    type: string,
    item: string,
    value: any,
    oldProps: any,
    newProps: any
  ): void {
    if (item === "position") {
      instance.position.set(value.x, value.y, value.z)
    }

    if (item === "target") {
      if (instance.parent && !instance.target.parent) {
        instance.parent.add(instance.target)
      }
      instance.target.position.set(value.x, value.y, value.z)
    }

    if (item === "ref") {
        if (newProps["ref"]) {
            newProps.ref(instance)
        }
    }
  }
}
