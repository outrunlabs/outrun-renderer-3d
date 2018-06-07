import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

import * as THREE from "three"

import { Components } from "./index"
import { Object3D } from "./Object3D"

import { traverse } from "./../Utility"

const audioLoader : any = new THREE.AudioLoader()

import { AudioListenerContext } from "./THREE/AudioListenerContext"

export interface SoundProps {
    soundFile: string
    loop?: boolean
    volume?: number
}



export class Sound extends React.PureComponent<SoundProps, {}> {

    public render(): JSX.Element {
        return <AudioListenerContext.Consumer>{(context) => {

            if (!context || !context.listener) {
                return null
            }

            return <InnerSound {...this.props} listener={context.listener} />
            
        }}
        </AudioListenerContext.Consumer>
    }
}

export interface InnerSoundProps extends SoundProps {
    listener: THREE.AudioListener
}

export class InnerSound extends React.PureComponent<InnerSoundProps, {}> {
    
    private _containerObject: THREE.Object3D
    private _sound: THREE.PositionalAudio

    public componentDidMount(): void {
        if (this._containerObject) {
            
            this._sound = new THREE.PositionalAudio(this.props.listener)

            audioLoader.load(this.props.soundFile, (buffer) => {

                this._sound.setBuffer(buffer)
                this._sound.setRefDistance(1)
                this._sound.setVolume(0.5)
                if (this.props.loop) {
                    this._sound.setLoop(false)
                }

                    
                this._sound.play()

            })

            this._containerObject.add(this._sound)
        }
    }

    public render(): JSX.Element {
        return <Object3D ref={(obj) => this._containerObject = obj} />
    }
}

