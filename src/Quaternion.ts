export type Quaternion = {
    x: number
    y: number
    z: number
    w: number
}

export namespace Quaternion {
    export const create = (x: number, y: number, z: number, w: number) => ({x, y, z, w})
    export const zero = () => create(0, 0, 0, 0)
}
