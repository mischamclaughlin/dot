import type {
    CanvasElement,
    DotDocument,
    InheritancePolicy,
    TextStyle,
} from "../model/DotDocument";

const emptyInheritancePolicy: InheritancePolicy = {
    geometry: [],
    style: [],
};

export function getParentRelationship(
    document: DotDocument,
    childId: string,
) {
    return (
        document.relationships.find(
            (relationship) => relationship.childId === childId,
        ) ?? null
    );
}

export function getInheritedAttributes(
    document: DotDocument,
    childId: string,
): InheritancePolicy {
    const relationship = getParentRelationship(document, childId);
    if (!relationship) return emptyInheritancePolicy;

    const parent = document.elements.find(
        (element) => element.id === relationship.parentId,
    );

    return parent?.childInheritance ?? emptyInheritancePolicy;
}

function inheritStyle(
    childStyle: TextStyle,
    parentStyle: TextStyle,
    attributes: InheritancePolicy["style"],
): TextStyle {
    const style = { ...childStyle };

    for (const attribute of attributes) {
        Object.assign(style, { [attribute]: parentStyle[attribute] });
    }

    return style;
}

export function resolveElement(
    document: DotDocument,
    elementId: string,
    visitedElementIds: ReadonlySet<string> = new Set(),
): CanvasElement | null {
    const element = document.elements.find(
        (candidate) => candidate.id === elementId,
    );
    if (!element) return null;

    const relationship = getParentRelationship(document, elementId);
    if (!relationship || visitedElementIds.has(elementId)) return element;

    const nextVisitedElementIds = new Set(visitedElementIds);
    nextVisitedElementIds.add(elementId);

    const parent = resolveElement(
        document,
        relationship.parentId,
        nextVisitedElementIds,
    );
    if (!parent) return element;

    const { geometry, style } = parent.childInheritance;

    return {
        ...element,
        area: {
            ...element.area,
            width: geometry.includes("width")
                ? parent.area.width
                : element.area.width,
            height: geometry.includes("height")
                ? parent.area.height
                : element.area.height,
        },
        style: inheritStyle(element.style, parent.style, style),
    };
}

export function wouldCreateParentCycle(
    document: DotDocument,
    parentId: string,
    childId: string,
): boolean {
    let currentId: string | null = parentId;
    const visitedElementIds = new Set<string>();

    while (currentId) {
        if (currentId === childId) return true;
        if (visitedElementIds.has(currentId)) return true;

        visitedElementIds.add(currentId);
        currentId =
            getParentRelationship(document, currentId)?.parentId ?? null;
    }

    return false;
}
