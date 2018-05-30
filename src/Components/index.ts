import * as React from "react"
import { Vector3 } from "./../Vector"
import { Mesh } from "./../Model"

export namespace Components {
    // export interface BoxProps {
    //     position: Vector3
    //     children?: any
    // }

    // export const Box = (props: BoxProps): JSX.Element => { return React.createElement("Box", props, props.children )}

    export interface GroupProps {
        position?: Vector3
        children?: any
    }

    // export const Group = (props: GroupProps): JSX.Element => { return React.createElement("Group", props, [...props.children]) }

    export const Group = "Group" as any

    export const AmbientLight = "AmbientLight" as any

    export const Box = "Box" as any

//     export const Group = (props: GroupProps) => 

//     export interface AmbientLightProps {
//         color: number 
//     }

//     export const AmbientLight = (props: AmbientLightProps): JSX.Element => { return React.createElement("AmbientLight", props)}

    export interface PointLightProps {
        color: number
        position: Vector3
        intensity: number
        decay: number
    }

    export const PointLight = (props: PointLightProps): JSX.Element => { return React.createElement("PointLight", props)}

    export interface SpotLightProps {
        position: Vector3
        target: Vector3
        color: number
        distance: number
        angle: number
        decay?: number
        intensity?: number
    }
    export const SpotLight = (props: SpotLightProps): JSX.Element => { return React.createElement("SpotLight", props) }

    export namespace Material {
        export interface BasicMaterialProps {
            color: number
            children: any
        }

        export const BasicMaterial = (props: BasicMaterialProps): JSX.Element => { 
            return React.createElement("BasicMaterial", props, props.children)
        }
    }
}
