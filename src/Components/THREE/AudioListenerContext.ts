import * as React from "react"

import * as THREE from "three"


export interface AudioListenerContextState {
    listener: THREE.AudioListener
}

export const DefaultAudioListenerContext: AudioListenerContextState = {
    listener: null
}

export const AudioListenerContext = React.createContext<AudioListenerContextState>(DefaultAudioListenerContext)
