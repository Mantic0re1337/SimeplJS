import { expect, test } from 'vitest'
import {objectsDiff} from "../utils/objects.js";

const objectDiffTestobj_old = {
    same: "same",
    removed: "removed",
    modified: "notmodified"
}

const objectDiffTestobj_new = {
    same: "same",
    added: "added",
    modified: "modified"
}

test('sample test', () => {
    expect(1).toBe(1)
})

test("objectsDiffDetectsAdded", () => {
    const diff = objectsDiff(objectDiffTestobj_old, objectDiffTestobj_new)
    const {added} = diff
    expect(added).toEqual(["added"])
})

test("objectsDiffDetectsRemoved", () => {
    const diff = objectsDiff(objectDiffTestobj_old, objectDiffTestobj_new)
    const {removed} = diff
    expect(removed).toEqual(["removed"])
})

test("objectsDiffDetectsModified", () => {
    const diff = objectsDiff(objectDiffTestobj_old, objectDiffTestobj_new)
    const {updated} = diff
    expect(updated).toEqual(["modified"])
})

test("objectsDiffDetectsModified", () => {
    const foo = {foo: "bar"}
    const bar = {foo: "bar"}
    const { added, removed, updated } = objectsDiff(foo, bar)
    expect(added).toEqual([])
    expect(removed).toEqual([])
    expect(updated).toEqual([])
})