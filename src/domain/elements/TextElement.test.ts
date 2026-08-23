import { describe, it, expect } from "vitest";
import { unknownTextElement, unknownTextStyle } from "../test/testFactory";
import { isTextElement } from "./TextElement";

describe("validates TextElement", () => {
    it("returns true for a valid TextElement", () => {
        const isValid = isTextElement(unknownTextElement());

        expect(isValid).toEqual(true);
    });

    it("returns false for an invalid TextElement", () => {
        const isValid = isTextElement(unknownTextElement(""));

        expect(isValid).toEqual(false);
    });

    describe("returns false for a malformed TextElement", () => {
        it("returns false when not an object", () => {
            const isValid = isTextElement("not an object");

            expect(isValid).toEqual(false);
        });

        it("returns false if ID isn't a string", () => {
            const isValid = isTextElement(unknownTextElement(1));

            expect(isValid).toEqual(false);
        });

        it("returns false if ID is an empty string", () => {
            const isValid = isTextElement(unknownTextElement(" "));

            expect(isValid).toEqual(false);
        });

        it("returns false for an invalid kind", () => {
            const isValid = isTextElement(
                unknownTextElement("text-1", "bad-kind"),
            );

            expect(isValid).toEqual(false);
        });

        it("returns false for an invalid Rect", () => {
            const isValid = isTextElement(
                unknownTextElement("text-1", "text", ""),
            );

            expect(isValid).toEqual(false);
        });

        it("returns false for bad text type", () => {
            const isValid = isTextElement(
                unknownTextElement(
                    "text-1",
                    "text",
                    {
                        x: 10,
                        y: 10,
                        width: 200,
                        height: 200,
                    },
                    666,
                ),
            );

            expect(isValid).toEqual(false);
        });

        describe("false isTextStyle", () => {
            it("returns false for bad TextStyle", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        "",
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for empty TextStyle", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        {},
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for negative fontSize", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(-10),
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for infinity fontSize", () => {
                let isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(Infinity),
                    ),
                );

                expect(isValid).toEqual(false);

                isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(-Infinity),
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for negative fontWeight", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(10, -10),
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for infinity fontWeight", () => {
                let isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(10, Infinity),
                    ),
                );

                expect(isValid).toEqual(false);

                isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(10, -Infinity),
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for invalid fg", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(10, 10, "fff"),
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("returns false for invalid bg", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(10, 10, "#fff", "000"),
                    ),
                );

                expect(isValid).toEqual(false);
            });

            it("return false for invalid isTextAlign", () => {
                const isValid = isTextElement(
                    unknownTextElement(
                        "text-1",
                        "text",
                        {
                            x: 10,
                            y: 10,
                            width: 200,
                            height: 200,
                        },
                        "good text type",
                        unknownTextStyle(
                            10,
                            10,
                            "#fff",
                            "#000",
                            "bad text align",
                        ),
                    ),
                );

                expect(isValid).toEqual(false);
            });
        });
    });
});
