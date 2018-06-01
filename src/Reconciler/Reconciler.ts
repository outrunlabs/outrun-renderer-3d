const Reconciler = require("react-reconciler")
const emptyObject = require("fbjs/lib/emptyObject")

type IntrinsicTypes =
  | "Box"
  | "AmbientLight"
  | "PointLight"
  | "Plane"
  | "SpotLight"
  | "Group"
  | "Mesh"

export interface ReconcilerCore<T> {
  appendChild(parent: T, child: T): void
  createElement(item: string, props: any): T
  updateElement(
    item: T,
    type: string,
    propertyName: string,
    propertyValue: any,
    oldProps: any,
    newProps: any
  ): void
}

export type Reconciler = any

export const createReconciler = <T>(core: ReconcilerCore<T>): Reconciler => {
  const debuggerFunction = (name: string) => () => {
    console.warn(name)
  }

  const createElement = (
    type: IntrinsicTypes,
    props,
    internalInstanceHandler
  ) => {
    return core.createElement(type, props)
  }

  const appendChild = (parent: T, child: T): void => {
    core.appendChild(parent, child)
  }

  const insertBefore = (parent: T, child: T, beforeChild: T): void => {
      core.appendChild(parent, child)
  }

  const appendChildToContainer = (parent: T, child: T): void => {
    core.appendChild(parent, child)
  }

  const commitUpdate = (
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) => {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const item = updatePayload[i + 0]
      const value = updatePayload[i + 1]
      core.updateElement(instance, type, item, value, oldProps, newProps)
    }
  }

  const CHILDREN = "children"

  // FROM https://github.com/michalochman/react-pixi-fiber/blob/master/src/ReactPixiFiber.js:
  // Calculate the diff between the two objects.
  // See: https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
  function diffProps(
    pixiElement,
    type,
    lastRawProps,
    nextRawProps,
    rootContainerElement
  ) {
    let updatePayload = null

    let lastProps = lastRawProps
    let nextProps = nextRawProps
    let propKey

    for (propKey in lastProps) {
      if (
        nextProps.hasOwnProperty(propKey) ||
        !lastProps.hasOwnProperty(propKey) ||
        lastProps[propKey] == null
      ) {
        continue
      }
      if (propKey === CHILDREN) {
        // Noop. Text children not supported
      } else {
        // For all other deleted properties we add it to the queue. We use
        // the whitelist in the commit phase instead.
        ;(updatePayload = updatePayload || []).push(propKey, null)
      }
    }
    for (propKey in nextProps) {
      const nextProp = nextProps[propKey]
      const lastProp = lastProps != null ? lastProps[propKey] : undefined
      if (
        !nextProps.hasOwnProperty(propKey) ||
        nextProp === lastProp ||
        (nextProp == null && lastProp == null)
      ) {
        continue
      }
      if (propKey === CHILDREN) {
        // Noop. Text children not supported
      } else {
        // For any other property we always add it to the queue and then we
        // filter it out using the whitelist during the commit.
        ;(updatePayload = updatePayload || []).push(propKey, nextProp)
      }
    }
    return updatePayload
  }

  return Reconciler({
    appendInitialChild(parentInstance: any, child: any) {
      core.appendChild(parentInstance, child)
    },

    createInstance(type: any, props: any, internalInstanceHandle: any) {
      return createElement(type, props, internalInstanceHandle)
    },

    createTextInstance(
      text: string,
      rootContainerInstance: any,
      internalInstanceHandler: any
    ) {
      return text
    },

    finalizeInitialChildren(rendererElement, type, props) {
        return false
    },

  commitMount(instance, type, updatePayload): void {
  },

    getPublicInstance(inst) {
      return inst
    },

    prepareForCommit() {
      // NOOP?
      // console.warn("TODO: PrepareForCommit")
    },

    prepareUpdate(rendererElement, type, oldProps, newProps, rootInstance) {
      // console.warn("prepareUpdate")
      return diffProps(rendererElement, type, oldProps, newProps, rootInstance)
      // return true
    },

    resetAfterCommit() {
      // console.warn("reset after commit")
      // noop
    },

    resetTextContent(rendererElement) {
      // noop
    },

    getRootHostContext(rootInstance) {
      // Can pass data from roots here?

      // console.warn("getRootHostContext")
      return rootInstance
    },

    getChildHostContext() {
      return emptyObject
    },

    shouldSetTextContent(type, props) {
      return false
    },

    now() {
      return performance.now()
    },
    

    shouldDeprioritizeSubtree(): boolean {
        return false
    },

    mutation: {
      appendChild: appendChild,
      appendChildToContainer: appendChildToContainer,
      commitMount: debuggerFunction("commitMount"),
      commitTextUpdate: debuggerFunction("commintTextUpdate"),
      commitUpdate: commitUpdate,
      insertBefore: insertBefore,
      insertInContainerBefore: debuggerFunction("insertInContainerBefore"),
      removeChild: debuggerFunction("removeChild"),
      removeChildFromContainer: debuggerFunction("removeChildFromContainer"),
    },
  })
}
