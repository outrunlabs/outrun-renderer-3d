
import { Vector3 } from "./../src/Vector"

describe("Vector3", () => {

    describe("cross", () => {
        it("gives correct value for cross of basis vectors", () => {
            const up = Vector3.up()
            const forward = Vector3.forward()

            const result = Vector3.cross(forward, up)
            const expected = Vector3.right()

            expect(result.x).toEqual(expected.x)
            expect(result.y === expected.y).toBe(true)
            expect(result.z).toEqual(expected.z)
        })
    })
    
})
