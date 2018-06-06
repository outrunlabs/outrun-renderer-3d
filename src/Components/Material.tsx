import * as React from "react"
import { Vector3 } from "./../Vector"
import { MaterialInfo } from "./../Material"
import { Texture } from "./../Texture"

import * as Utility from "./../Utility"

import { createMaterialFromInfo, ThreeMaterialContext } from "./THREE/ThreeMaterialContext"

export interface MaterialProps {
   material: MaterialInfo
}

const NormalMaterial: MaterialInfo = {
    type: "normal"
}


export interface MaterialState {
    material: THREE.Material
}

export class Material extends React.PureComponent<MaterialProps, MaterialState> {

    constructor(props: MaterialProps) {
        super(props)

        this.state = {
            material: null
        }
    }

    public componentDidMount(): void {

        if (this.props.material) {
            this.setState({
                material: createMaterialFromInfo(this.props.material)
            })
        }
        
    }

    public render(): JSX.Element {

        if (!this.state.material) {
            return null
        }

        return <ThreeMaterialContext.Provider value={this.state}>
                {this.props.children}
            </ThreeMaterialContext.Provider>
    }
}


export type PromiseableTexture = Texture | Promise<Texture> | null

export interface StandardMaterialProps {
    diffuseMap?: PromiseableTexture
    normalMap?: PromiseableTexture
    emissiveMap?: PromiseableTexture
    specularMap?: PromiseableTexture
}

export interface StandardMaterialState {
    hasLoaded: boolean
    material: THREE.Material,
}

export class StandardMaterial extends React.PureComponent<StandardMaterialProps, StandardMaterialState> {

    constructor(props: StandardMaterialProps) {
        super(props)

        this.state = {
            hasLoaded: false,
            material: null,
        }
    }

    public componentDidMount(): void {

        const maps = [this.props.diffuseMap, this.props.normalMap, this.props.emissiveMap, this.props.specularMap]

        const promisifiedMaps = maps.map((m) => Utility.wrapAsPromiseIfNot(m))

        Promise.all(promisifiedMaps).then((loadedMaps) => {
            const [diffuse, normal, emissive, specular] = loadedMaps

            let material: MaterialInfo = null

            if (specular) {
                material = {
                    type: "phong",
                    normalMap: normal,
                    diffuseMap: diffuse,
                    emissiveMap: emissive,
                    specularMap: specular,
                }
                
            } else {
                    material= {
                    type: "standard",
                    normalMap: normal,
                    diffuseMap: diffuse,
                    emissiveMap: emissive,
                    // specular: TODO
                }
            }

            this.setState({
                hasLoaded: true,
                material: createMaterialFromInfo(material),
            })
        })
        
    }

    public render(): JSX.Element {
        if (!this.state.hasLoaded) {
            return null
        }

        return <ThreeMaterialContext.Provider value={{ material: this.state.material}}>
            {this.props.children}
            </ThreeMaterialContext.Provider>
    }
}
