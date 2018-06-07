import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { traverse } from "./../Utility"

const audioLoader = new THREE.AudioLoader()

export interface SoundProps {
    soundFile: string
    loop?: boolean
    volume?: number
}



export class Sound extends React.PureComponent<SoundProps, {}> {
    private _object: THREE.Object3D

    public componentDidMount(): void {
        if (this._object) {
            this._object.add(this.props.skeletonRoot)
        }
    }
    
    public render(): JSX.Element {
        return <Object3D ref={(obj) => this._object = obj }>
        {this.props.children}
        </Object3D>
    }
}

