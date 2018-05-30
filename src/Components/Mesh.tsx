import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh as MeshGeometry } from "./../Model"

import * as Utility from "./../Utility"

import * as THREE from "three"

import { Components } from "./index"
import {InternalMeshWithMaterial} from "./InternalMeshWithMaterial"

import { MaterialContext, MaterialProps } from "./Material"

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

        const meshAsPromise = Utility.wrapAsPromiseIfNot<MeshGeometry>(this.props.mesh)

        meshAsPromise.then((mesh) => {
            this.setState({
                loadedMesh: mesh
            })
        })
    }

    public render(): JSX.Element {
        if (!this.state.loadedMesh) {
            return null    
        }

        return <MaterialContext.Consumer>{(val: MaterialProps) => {
            return <InternalMeshWithMaterial mesh={this.state.loadedMesh} material={val.material} />
        }}
        </MaterialContext.Consumer>
    }
}

