import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh as MeshGeometry } from "./../Model"

import * as Utility from "./../Utility"

import * as THREE from "three"

import { Components } from "./index"


import { ThreeMaterialContext } from "./THREE/ThreeMaterialContext"
import { ThreeMeshWithMaterial } from "./THREE/ThreeMeshWithMaterial"

import { SkeletonContext } from "./Skeleton"

export interface MeshProps {
  mesh: MeshGeometry | Promise<MeshGeometry>
}

export interface MeshState {
  loadedMesh: MeshGeometry
}

export class Mesh extends React.PureComponent<MeshProps, MeshState> {
  constructor(props: MeshProps) {
    super(props)

    this.state = {
      loadedMesh: null,
    }
  }

  public componentDidMount(): void {
    const meshAsPromise = Utility.wrapAsPromiseIfNot<MeshGeometry>(
      this.props.mesh
    )

    meshAsPromise.then(mesh => {
      this.setState({
        loadedMesh: mesh,
      })
    })
  }

  public render(): JSX.Element {
    if (!this.state.loadedMesh) {
      return null
    }

    return (
      <ThreeMaterialContext.Consumer>
        {(val: {material: THREE.Material}) => {
          return (
            <SkeletonContext.Consumer>
              {skeleton => {
                return (
                  <ThreeMeshWithMaterial
                    mesh={this.state.loadedMesh}
                    material={val.material}
                    skeleton={skeleton.skeleton}
                  />
                )
              }}
            </SkeletonContext.Consumer>
          )
        }}
      </ThreeMaterialContext.Consumer>
    )
  }
}
