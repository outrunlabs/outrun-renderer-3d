import * as React from "react"
import { Vector3 } from "./../Vector"
import { MaterialInfo } from "./../Material"
import { Texture } from "./../Texture"

import * as Utility from "./../Utility"

export interface MaterialProps {
   material: MaterialInfo
}

const NormalMaterial: MaterialInfo = {
    type: "normal"
}

const DefaultMaterial = NormalMaterial

export const MaterialContext = React.createContext<MaterialProps>({
    material: DefaultMaterial,
})

export class Material extends React.PureComponent<MaterialProps, {}> {
    public render(): JSX.Element {
        return <MaterialContext.Provider value={this.props}>
                {this.props.children}
            </MaterialContext.Provider>
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
    materialInfo: MaterialProps,
}

export class StandardMaterial extends React.PureComponent<StandardMaterialProps, StandardMaterialState> {

    constructor(props: StandardMaterialProps) {
        super(props)

        this.state = {
            hasLoaded: false,
            materialInfo: null,
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
                materialInfo: { 
                    material,
                }
            })
        })
        
    }


    public render(): JSX.Element {
        if (!this.state.hasLoaded) {
            return null
        }

        return <MaterialContext.Provider value={this.state.materialInfo}>
            {this.props.children}
            </MaterialContext.Provider>
    }
}
