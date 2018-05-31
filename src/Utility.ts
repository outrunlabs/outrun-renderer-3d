export const getFileExtension = (pathInfo: string): string | null => {
    if (!pathInfo) {
        return null
    }

    const splitPath = pathInfo.split(".")
    return splitPath[splitPath.length - 1]
}

export const isPromise = (promiseCandidate: any): boolean => {
    return !!promiseCandidate && !!promiseCandidate.then
}

export const wrapAsPromiseIfNot = <T>(c: T | Promise<T>): Promise<T> => {
    
    if (isPromise(c)) {
        return c as Promise<T>
    }

    return Promise.resolve(c)
}


export interface SomethingWithChildren {
    children: SomethingWithChildren[]
}

export const traverse = <T extends SomethingWithChildren>(items: T[], callback: (obj: T) => void) => {
    for (let i = 0; i < items.length; i++) {
        callback(items[i])

        traverse(items[i].children, callback)
    }
}
