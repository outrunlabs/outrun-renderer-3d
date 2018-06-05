import * as React from "react"
import * as THREE from "three"

import { Camera, Components } from "./../../src"

const renderer = require("react-test-renderer")

const renderComponent = (component: JSX.Element): any => {
        return renderer.create((<Components.Camera lookAt={{x: 0, y: 0, z: 1}} position={{x: 0, y: 0, z:0 }} aspectRatio={1} near={0} far={500}>
                {component}
            </Components.Camera>))
}

const ToggleComponent = (props: { visible: boolean, objectRef: any }) => {
    return <Components.Transform objectRef={props.objectRef}>
            { props.visible ? <Components.Transform /> : null}
        </Components.Transform>
}

describe("createReconciler", () => {
    it("sets default properties", () => {
        let test: THREE.Object3D
        renderComponent(<Components.Transform objectRef={(obj) => test = obj}/>)

        expect(test.position).toEqual(new THREE.Vector3(0, 0, 0))
        expect(test.scale).toEqual(new THREE.Vector3(1, 1, 1))
        expect(test.rotation.toVector3()).toEqual(new THREE.Vector3(0, 0, 0))
    })

    it("sets position", () => {
        let test: THREE.Object3D

        renderComponent(<Components.Transform objectRef={(obj) => test = obj} transform={[{translate: {x: 1, y: 2, z: 3}}]}/>)
        expect(test.position).toEqual(new THREE.Vector3(1, 2, 3))
    })

    it("appends child", () => {
        
        let test: THREE.Object3D
        let innerTest: THREE.Object3D
        renderComponent(<Components.Transform objectRef={(obj) => test = obj}>
                            <Components.Transform objectRef={(obj) => innerTest = obj} />
                    </Components.Transform>)

        expect(test.children.length).toEqual(1)
        expect(test.children[0]).toBe(innerTest)
    })

    it("removes element on update", () => {
        let test: THREE.Object3D
        let element = renderComponent(<ToggleComponent visible={true} objectRef={(obj) => test = obj} />)

        expect(test.children.length).toEqual(1)

        let updatedTest: THREE.Object3D
        element.update(<ToggleComponent visible={false} objectRef={() => {}}/>)
        expect(test.children).toBe([])
    })
})
