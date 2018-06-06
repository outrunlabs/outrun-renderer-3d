import * as React from "react"

import * as THREE from "three"

import { MaterialInfo } from "./../../Material"

export type ThreeMaterialContextState = {
    material: THREE.Material
}

const DefaultMaterial = {
    material: null
}

export const ThreeMaterialContext = React.createContext<ThreeMaterialContextState>(DefaultMaterial)

export const createMaterialFromInfo = (material: MaterialInfo): any => {
    switch (material.type) {
        case "basic":
            return new THREE.MeshBasicMaterial({color: material.color})
        case "normal":
            return new THREE.MeshNormalMaterial()
        case "standard":
            return new THREE.MeshStandardMaterial({
                map: material.diffuseMap ? material.diffuseMap.raw : null,
                normalMap: material.normalMap ? material.normalMap.raw : null,
                emissiveMap: material.emissiveMap ? material.emissiveMap.raw : null,
                emissiveIntensity: material.emissiveIntensity || 0,
                color: 0xFFFFFF,
            })
        case "phong":
            return new THREE.MeshPhongMaterial({
                map: material.diffuseMap ? material.diffuseMap.raw : null,
                normalMap: material.normalMap ? material.normalMap.raw : null,
                emissiveMap: material.emissiveMap ? material.emissiveMap.raw : null,
                specularMap: material.specularMap ? material.specularMap.raw : null,
                emissiveIntensity: material.emissiveIntensity || 0,
                color: 0xFFFFFF,
                
            })
        // default:
        //     throw new Error("Unknown material type: " + material.type)
    }
}
