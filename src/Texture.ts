
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
        if (ext === "tga") {
            return loadTga(texturePath)     
        }

        throw new Error("No runtime loader available for: " + ext)
    }

    const loadTga = async (tgaTexturePath): Promise<Texture> => {
        return new Promise<Texture>((res, reject) => {
            TGALoader.load(tgaTexturePath, (result: any) => {
                res(createFromRaw(result))
            })  
        })
    }
}
