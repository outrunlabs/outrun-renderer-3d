
import * as THREE from "three"

import { TGALoader } from "./TGALoader"

import * as Utility from "./Utility"

export interface Texture {
   raw: any 
}

export namespace Texture {

    const createFromRaw = (raw: any): Texture => ({
        raw,
    })

    export const fromFile = async (texturePath: string): Promise<Texture> => {
        const ext = Utility.getFileExtension(texturePath.toLowerCase())
        switch (ext) {
            case "tga":
                return loadTga(texturePath)
            case "jpg":
                return loadJpg(texturePath)
            default:
                throw new Error("No runtime loader available for: " + ext)
        }
    }

    const loadJpg = async (jpgTexturePath): Promise<Texture> => {
        return new Promise<Texture>((res, reject) => {
            const imageLoader = new THREE.TextureLoader()
            imageLoader.load(jpgTexturePath, (result) => {
                res(createFromRaw(result))
            })
            
        })
    }

    const loadTga = async (tgaTexturePath): Promise<Texture> => {
        return new Promise<Texture>((res, reject) => {
            TGALoader.load(tgaTexturePath, (result: any) => {
                res(createFromRaw(result))
            })  
        })
    }
}
