import { describe, expect, it } from "vitest";

import { isRecord } from "./isRecord";

describe("isRecord", () => {
    it.each([
        {
            description: "a plain object",
            value: {},
        },
        {
            description: "a null-prototype object",
            value: Object.create(null),
        },
    ])("accepts $description", ({ value }) => {
        expect(isRecord(value)).toBe(true);
    });

    it.each([
        {
            description: "null",
            value: null,
        },
        {
            description: "an array",
            value: [],
        },
        {
            description: "a Date",
            value: new Date(),
        },
        {
            description: "a Map",
            value: new Map(),
        },
        {
            description: "an object with a custom prototype",
            value: Object.create({ inherited: true }),
        },
        {
            description: "a primitive",
            value: "not an object",
        },
    ])("rejects $description", ({ value }) => {
        expect(isRecord(value)).toBe(false);
    });
});
