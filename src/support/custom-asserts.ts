import { expect } from "@jest/globals"

export function arrayContains(obj: unknown) {
    return expect.arrayContaining([expect.objectContaining(obj as any)])
}
