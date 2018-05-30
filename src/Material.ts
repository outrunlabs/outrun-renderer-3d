
import * as THREE from "three"

const FBXLoader = require("three-fbx-loader")
const fbxLoader = new FBXLoader()

import { Texture } from "./Texture"

export type MaterialInfo = {
    type: "normal",
} | {
    type: "standard",
    alphaMap?: Texture
    emissiveMap?: Texture
    diffuseMap?: Texture
    normalMap?: Texture
    bumpMap?: Texture
    emissiveIntensity?: number
} | {
    type: "phong",
    alphaMap?: Texture
    emissiveMap?: Texture
    diffuseMap?: Texture
    normalMap?: Texture
    specularMap?: Texture
    bumpMap?: Texture
    emissiveIntensity?: number
} | {
    type: "basic",
    color: number,
}

export interface MaterialProps {
    alphaMap?: Texture
    emissiveMap?: Texture
    diffuseMap?: Texture
    normalMap?: Texture
    bumpMap?: Texture

    emissiveIntensity?: number
}


export interface Material extends MaterialProps {
}

export namespace Material {
    export const createStandard = (props: MaterialProps): Material => ({
        ...props,
    })
}

