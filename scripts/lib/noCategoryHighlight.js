export function setupDevHighlightActionsNoCategory(active) {
    if (active) {
        Hooks.on("renderActorSheetPF2e", devHighlightActionsNoCategory)
    } else {
        Hooks.off("renderActorSheetPF2e", devHighlightActionsNoCategory)
    }
}

async function devHighlightActionsNoCategory(sheet, html) {
    const actualHTMl = html?.[0];
    const actor = sheet?.object;

    const relevantActionIDs = new Set(actor?.itemTypes?.action
        .filter(action => !action.system.category)
        .map(action => action.id));

    const elements = actualHTMl.querySelectorAll('[data-item-id]');

    elements.forEach(element => {
        const itemId = element.getAttribute('data-item-id');
        if (idSet.has(itemId)) {
            element.classList.add('pyxie-missing-category');
        }
    });
}