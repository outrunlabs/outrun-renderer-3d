import { ReconcilerCore } from "./Reconciler"

export interface DummyElement {
    children: DummyElement[]
    type: string
    props: any
}

export const createDummyElement = (type: string, props: any) => ({
    children: [],
    type, 
    props,
})

export class DummyReconcilerCore implements ReconcilerCore<any> {
  public appendChild(parent: DummyElement, child: DummyElement): void {
      console.log("appendChild")

      console.dir(parent)
      console.dir(child)

      parent.children.push(child)
  }

  public createElement(type: string, props: any): DummyElement{
      console.log("createElement: " + type)
      return createDummyElement(type, props)
  }

  public updateElement(
    instance: any,
    type: string,
    item: string,
    value: any,
    oldProps: any,
    newProps: any
  ): void {
      instance.props = newProps
  }
}
