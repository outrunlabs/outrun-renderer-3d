
import * as THREE from "three"

const FBXLoader = require("three-fbx-loader")
const fbxLoader = new FBXLoader()


import { Mesh, convertBufferGeometryToMesh } from "./Model"

import * as Utility from "./Utility"

// export type Matrix4 = THREE.Matrix4

// export interface Bone {
//     name: string
//     index: number
//     parentBoneIndex: number
// }

// export type NameToBone = {[boneName: string]: Bone}

// export interface Skeleton {
//     boneInverses: Matrix4[]
//     bones: NameToBone
//     boneMatrices: Matrix[]
// }

export interface SkinnedMesh {
    skinnedMeshParts: SkinnedMeshParts[]
    skeletalRoot: THREE.Object3D
    animations: THREE.AnimationClip[]
}

export interface SkinnedMeshParts {
    skeleton: THREE.Skeleton
    skinnedMesh: Mesh
}


const convertGroupToSkinnedMesh = (bg: THREE.Group): SkinnedMesh => {

    const meshParts: SkinnedMeshParts[] = []

    for (var i = 0; i < bg.children.length; i++) {
        const item = bg.children[i]

        if (item.type !== "SkinnedMesh") {
           continue 
        }

        const sm = item as THREE.SkinnedMesh
        const mesh = convertBufferGeometryToMesh(sm.geometry as any);
        (mesh as any).bindMatrix = sm.bindMatrix;
        (mesh as any).matrix = sm.matrix;

//         const skeleton = getSkeletonFromThreeSkeleton(sm.skeleton)

//         const convertedBackSkeleton = getThreeSkeletonFromSkeleton(skeleton)

        meshParts.push({
            skinnedMesh: mesh,
            skeleton: sm.skeleton,
        })
    }

    const firstMeshPart = meshParts[0]
    let currentBone = meshParts[0].skeleton.bones[0]
    let hierarchyup = []
    let parent = currentBone.parent
    while (parent) {
        hierarchyup.push(parent)
       parent = parent.parent 
    }            

    const secondToLastParent = hierarchyup[hierarchyup.length - 2]

    Utility.traverse(secondToLastParent as any, (t: any) => {
        if (t.type !== "Bone") {
        t.visible = false
        }
    })

    return {
        skinnedMeshParts: meshParts,
        animations: (bg as any).animations,
        skeletalRoot: secondToLastParent,
    }
}

// const getSkeletonFromThreeSkeleton = (skeleton: THREE.Skeleton): Skeleton => {

//     let boneInverses: Matrix4[] = []
//     let boneMatrixWorld: Matrix4[] = []
//     let bones: NameToBone = {}
//     let ret: Skeleton = {
//         boneInverses,
//         boneMatrices: boneMatrixWorld,
//         bones,
//     }

//     // First pass - get all bones in array
//     for (let i = 0; i < skeleton.bones.length; i++) {
//         const bone = skeleton.bones[i]

//         bones[bone.name] = {
//             name: bone.name,
//             index: i,
//             parentBoneIndex: -1,
//         }

//         boneInverses.push(skeleton.boneInverses[i])
//         boneMatrixWorld.push(bone.matrix)
//     }

//     // Second pass - properly wire up hierarchy

//     for (let i = 0; i < skeleton.bones.length; i++) {
//         const bone = skeleton.bones[i]
//         const boneName = bone.name

//         if (bone.parent && bone.parent.type === "Bone") {
//             const parentIndex = bones[bone.parent.name].index
//             bones[bone.name].parentBoneIndex = parentIndex
//         }
//     }


//     return ret
// }

// const getThreeSkeletonFromSkeleton = (skeleton: Skeleton): THREE.Skeleton => {

//     const bones = Object.keys(skeleton.bones).map((key) => skeleton.bones[key]).sort((a, b) => b.index - a.index)

//     const threeBones: THREE.Bone[] = []
//     const inverseMatrices: Matrix4[] = []

//     let nameToThreeBone : {[boneName: string]: THREE.Bone} = {}

//     bones.forEach((b) => {
//         const threeBone = new THREE.Bone()
//         threeBone.name = b.name
//         nameToThreeBone[b.name] = threeBone
//        threeBones.push(threeBone) 
//         const invMatrix = skeleton.boneInverses[b.index]
//         inverseMatrices.push(invMatrix)
//     })

//     bones.forEach((b) => {
//         const threeBone = nameToThreeBone[b.name]

//         if (b.parentBoneIndex === -1)
//             return

//         const parentBone = bones[b.parentBoneIndex]
//         const parentThreeBone = nameToThreeBone[parentBone.name]

//         threeBone.matrix = skeleton.boneMatrices[b.index]

//         parentThreeBone.add(threeBone)
//     })

//     const threeSkeleton = new THREE.Skeleton(threeBones)

//     return threeSkeleton

    
// }

export namespace SkinnedMesh {

    export const fromFile = async (modelPath: string): Promise<SkinnedMesh> => {
        const ext = Utility.getFileExtension(modelPath.toLowerCase())

        switch(ext) {
            case "fbx":
                return await loadMeshFromFbx(modelPath)
            default:
                throw new Error("No loader available for: " + ext)
        }
    }

    const loadMeshFromFbx = (modelPath: string): Promise<SkinnedMesh> => {

        const objLoader = new THREE.OBJLoader()

        return new Promise((res, rej) => {

            fbxLoader.load(modelPath, (group: any) => {
                const convertedMesh = convertGroupToSkinnedMesh(group)
                res(convertedMesh)
            })
            
        })
        
    }
    
}
