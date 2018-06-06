export * from "./Camera"
export * from "./Material"
export * from "./Model"
export * from "./SkinnedMesh"
export * from "./Texture"
export * from "./Vector"

import { Components as BaseComponents }from "./Components"
import { Components as SceneComponents }from "./Scene"
import { Camera } from "./Camera"
import { Plane } from "./Components/Plane"
import { Mesh } from "./Components/Mesh"
import { Material, StandardMaterial } from "./Components/Material"
import { Skeleton, SkeletalRoot } from "./Components/Skeleton"
import { Bone } from "./Components/Bone"
import { Group, Transform } from "./Components/Transform"
import { Terrain } from "./Components/Terrain"

export const Components = {
    ...BaseComponents,
    ...SceneComponents,
    Camera,
    Material,
    StandardMaterial,
    Mesh,
    Plane,
    Skeleton,
    SkeletalRoot,
    Bone,
    Group,
    Terrain,
    Transform,
}
