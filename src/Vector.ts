export type Vector2 = {
    x: number
    y: number
}

export namespace Vector2 {
    export const create = (x: number, y: number) => ({ x, y })
    export const zero = () => ({ x: 0, y: 0 })
}

export type Vector3 = {
    x: number
    y: number
    z: number
}

export namespace Vector3 {
    export type BasisVectors = {
        up: Vector3
        forward: Vector3
        right: Vector3
    }

    export const create = (x: number, y: number, z: number) => ({ x, y, z })

    export const zero = (): Vector3 => Vector3.create(0, 0, 0)
    export const unit = (): Vector3 => Vector3.create(1, 1, 1)

    export const up = (): Vector3 => Vector3.create(0, 1, 0)
    export const forward = (): Vector3 => Vector3.create(0, 0, -1)
    export const right = (): Vector3 => Vector3.create(1, 0, 0)

    export const add = (v1: Vector3, v2: Vector3) => {
        return Vector3.create(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }

    export const subtract = (v1: Vector3, v2: Vector3) => {
        return Vector3.create(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }

    export const multiplyScalar = (v1: Vector3, scalar: number) => {
        return Vector3.create(v1.x * scalar, v1.y * scalar, v1.z * scalar)
    }

    export const lerp = (v1: Vector3, v2: Vector3, a: number) => {
        const invA = 1.0 - a
        return Vector3.create(
            v1.x * invA + v2.x * a,
            v1.y * invA + v2.y * a,
            v1.z * invA + v2.z * a,
        )
    }

    export const dot = (v1: Vector3, v2: Vector3) => {
        return v1.x * v2.x + v1.y * v2.y + v1.x * v2.y
    }

    export const cross = (v1: Vector3, v2: Vector3) => {
        return Vector3.create(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x,
        )
    }

    export const lengthSquared = (v: Vector3): number => {
        return v.x * v.x + v.y * v.y + v.z * v.z
    }

    export const length = (v: Vector3): number => {
        return Math.sqrt(lengthSquared(v))
    }

    export const scale = (v: Vector3, scale: number): Vector3 => {
        return Vector3.create(v.x * scale, v.y * scale, v.z * scale)
    }

    export const normalize = (v: Vector3): Vector3 => {
        const length = Vector3.length(v)
        return Vector3.scale(v, 1 / length)
    }

    export const getForwardVectorFromYawPitch = (yaw: number, pitch: number): Vector3 => {
        // Used from: https://gamedev.stackexchange.com/questions/71320/how-do-i-determine-the-look-at-vector-of-a-free-look-camera
        const adjPitch: number = pitch + Math.PI
        const x = Math.sin(yaw) * Math.cos(adjPitch)
        const y = Math.sin(adjPitch)
        const z = Math.cos(yaw) * Math.cos(adjPitch)

        return Vector3.create(x, y, z)
    }

    export const getUpVectorFromYawPitch = (yaw: number, pitch: number): Vector3 => {
        const adjPitch: number = pitch + Math.PI
        const x = Math.sin(yaw) * Math.sin(adjPitch) * -1
        const y = Math.cos(adjPitch)
        const z = Math.cos(yaw) * Math.sin(adjPitch) * -1

        return Vector3.create(x, y, z)
    }

    export const getLookAtVectorFromPositionYawPitch = (
        position: Vector3,
        yaw: number,
        pitch: number,
    ): Vector3 => {
        const forward = getForwardVectorFromYawPitch(yaw, pitch)

        return Vector3.create(
            forward.x + position.x,
            forward.y + position.y,
            forward.z + position.z,
        )
    }

    export const getBasisVectorsFromYawPitch = (yaw: number, pitch: number): BasisVectors => {
        const forward = getForwardVectorFromYawPitch(yaw, pitch)
        const up = getUpVectorFromYawPitch(yaw, pitch)
        const right = Vector3.cross(forward, up)

        return {
            forward,
            up,
            right,
        }
    }
}
