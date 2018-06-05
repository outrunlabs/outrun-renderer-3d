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
      parent.children.push(child)
  }

  public createElement(type: string, props: any): DummyElement{
      return createDummyElement(type, props)
  }

  public removeChild(parent: DummyElement, child: DummyElement): void {
      parent.children = parent.children.filter((c) => c !== child)
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
