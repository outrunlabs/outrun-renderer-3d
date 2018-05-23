const Reconciler = require("react-reconciler")
const emptyObject = require("fbjs/lib/emptyObject")

import * as THREE from "three"

type IntrinsicTypes = "Box" | "AmbientLight" | "PointLight" | "Plane"

const debuggerFunction = (name: string) => () => {
    console.warn(name)
    debugger
}

const createElement = (types: IntrinsicTypes, props, internalInstanceHandler) => {
    console.warn("create element")

    switch (types) {
        case "AmbientLight":
            const light = new THREE.AmbientLight(props.color)
            return light
        case "PointLight":
            const pointLight = new THREE.PointLight(props.color, props.intensity, props.decay)
            pointLight.position.set(props.position.x, props.position.y, props.position.z)
            pointLight.castShadow = true

            pointLight.shadow.mapSize.width = 512
            pointLight.shadow.mapSize.height = 512
            
            return pointLight
        case "Plane":
            const planeGeometry = new THREE.PlaneGeometry(500, 500, 1, 1)
            const mesh2 = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0x090909 }))
            mesh2.rotateX(-Math.PI / 2)
            mesh2.position.set(0, -1, 0)
            mesh2.updateMatrix()
            mesh2.receiveShadow = true
            return mesh2
        case "Box":
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
            // const material = new THREE.MeshLambertMaterial()
            // const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: diffuseTexture }
            const mesh3 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }))
            mesh3.receiveShadow = false
            mesh3.castShadow = true

            mesh3.position.set(props.position.x, props.position.y, props.position.z)
            mesh3.updateMatrix()
            return mesh3
        default:
            return null
    }
}


const appendChild = (parentInstance: THREE.Object3D, child: THREE.Object3D): void => {
    parentInstance.add(child)
}

export const commitUpdate = (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) => {

    const [item, value] = updatePayload

    if (item === "position") {
        instance.position.set(value.x, value.y, value.z)
    }
}

export const CHILDREN = "children"

// FROM https://github.com/michalochman/react-pixi-fiber/blob/master/src/ReactPixiFiber.js:
// Calculate the diff between the two objects.
// See: https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
export function diffProps(pixiElement, type, lastRawProps, nextRawProps, rootContainerElement) {
  let updatePayload = null;

  let lastProps = lastRawProps;
  let nextProps = nextRawProps;
  let propKey;

  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps != null ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
      continue;
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  return updatePayload;
}

export const Renderer3dReconciler = Reconciler({
    appendInitialChild(parentInstance: HTMLElement, child: HTMLElement) {
        if (parentInstance.appendChild) {
            parentInstance.appendChild(child)
        } else {
            console.warn("TODO: appendInitialChild case")
        }
    },

    createInstance(type: any, props: any, internalInstanceHandle: any) {
        return createElement(type, props, internalInstanceHandle)
    },

    createTextInstance(text: string, rootContainerInstance: any, internalInstanceHandler: any) {
        return text
    },

    finalizeInitialChildren(rendererElement, type, props) {
        console.warn("finalizeInitializeChildren")
        return false
    },

    getPublicInstance(inst) {
        return inst
    },

    prepareForCommit() {
        // NOOP?
        console.warn("TODO: PrepareForCommit")
    },

    prepareUpdate(rendererElement, type, oldProps, newProps, rootInstance) {
        console.warn("prepareUpdate")
        return diffProps(rendererElement, type, oldProps, newProps, rootInstance)
    },

    resetAfterCommit() {
        console.warn("reset after commit")
        // noop
    },

    resetTextContent(rendererElement) {
        // noop
    },

    getRootHostContext(rootInstance) {
        // Can pass data from roots here?

        console.warn("getRootHostContext")
    },

    getChildHostContext() {
        return emptyObject
    },

    shouldSetTextContent(type, props) {
        return emptyObject
    },

    now() {
        return performance.now()
    },

    useSyncScheduling: true,

    mutation: {
        appendChild: appendChild,
        appendChildToContainer: appendChild,
        commitMount: debuggerFunction("commitMount"),
        commitTextUpdate: debuggerFunction("commintTextUpdate"),
        commitUpdate: commitUpdate,
        insertBefore: debuggerFunction("insertBefore"),
        insertInContainerBefore: debuggerFunction("insertInContainerBefore"),
        removeChild: debuggerFunction("removeChild"),
        removeChildFromContainer: debuggerFunction("removeChildFromContainer"),
    }
})

