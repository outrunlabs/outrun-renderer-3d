import * as React from "react")

import {createReconciler,  DummyReconcilerCore, createDummyElement } from "./../../src/Reconciler"

const TAG1 = "TAG1" as any

describe("createReconciler", () => {

    it("appends to root", () => {
        const dummyRoot = createDummyElement("ROOT", {})

        const reconciler = createReconciler(new DummyReconcilerCore())
        const mountNode = reconciler.createContainer(dummyRoot)

        const out = reconciler.updateContainer(React.createElement("TAG1", {key: 1}, null),  mountNode, null)

        expect(dummyRoot.children.length).toBe(1)
    })

    it("appends nested element", () => {
        
        const dummyRoot = createDummyElement("ROOT", {})
        const reconciler = createReconciler(new DummyReconcilerCore())
        const mountNode = reconciler.createContainer(dummyRoot)

        const out = reconciler.updateContainer(React.createElement("TAG1", {key: 1}, React.createElement("TAG_NESTED", {})),  mountNode, null)

        expect(dummyRoot.children.length).toBe(1)
        expect(dummyRoot.children[0].children.length).toBe(1)
    })
})
