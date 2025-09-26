export function setupDevHighlightActionsWorldLink(active) {
    if (active) {
        Hooks.on("renderActorSheetPF2e", renderActorSheetPF2e)
        Hooks.on("renderItemSheetPF2e", renderItemSheetPF2e)
    } else {
        Hooks.off("renderActorSheetPF2e", renderActorSheetPF2e)
        Hooks.off("renderItemSheetPF2e", renderItemSheetPF2e)
    }
}

//TODO also handle highlight the specific tab

//TODO also handle highlight the specific instance

const regexWorldLink = /@UUID\[(?!Compendium)/g;
const tag = 'pyxie-world-link'

async function renderActorSheetPF2e(sheet, html) {
    const actualHTMl = html?.[0];
    const actor = sheet?.object;
    if (actor?.type === 'character') return

    const relevantActionIDs = new Set(actor?.itemTypes?.action
        .filter(action =>
            hasWorldLinkDescription(action) ||
            hasWorldLinkSelfEffect(action) ||
            hasWorldLinkRuleElement(action)
        )
        .map(action => action.id));

    const elements = actualHTMl.querySelectorAll('[data-item-id]');

    elements.forEach(element => {
        const itemId = element.getAttribute('data-item-id');
        if (relevantActionIDs.has(itemId)) {
            element.classList.add(tag);
        }
    });
}

async function renderItemSheetPF2e(sheet, html) {
    const action = sheet?.object;
    const actualHTMl = html?.[0];

    if (hasWorldLinkDescription(action)) {
        styleTab('description')

        const contentLinks = document.querySelectorAll('sheet-body .content-link[data-uuid]');
        contentLinks.forEach(link => {
            const uuid = link.getAttribute('data-uuid');
            if (uuid && !uuid.startsWith('Compendium')) {
                link.classList.add(tag);
            }
        });
    }

    if (hasWorldLinkSelfEffect(action)) {
        styleTab('details')

        const selfEffect = actualHTMl
            .querySelector('.form-group[data-drop-zone="self-applied-effect"]')
        selfEffect.classList.add(tag)
    }

    if (hasWorldLinkRuleElement(action)) {
        styleTab('rules')
        const relevantRulesIDXs = getWorldLinkRuleElementIDXs(action);

        const elements = actualHTMl.querySelectorAll('section.rule-form');
        elements.forEach(element => {
            const itemId = element.getAttribute('data-idx');
            if (relevantRulesIDXs.has(itemId)) {
                element.classList.add(tag);
            }
        });
    }
}

function styleTab(tab) {
    const tabHTML = actualHTMl
        .querySelector(`.sheet-tabs .tabs a.list-row[data-tab="${tab}"]`)
    tabHTML.classList.add(tag)
}

function hasWorldLinkDescription(action) {
    return !!action?.system?.description?.value.match(regexWorldLink);
}

function hasWorldLinkSelfEffect(action) {
    return !!action?.system.selfEffect.uuid &&
        !action?.system.selfEffect.uuid?.startWith('Compendium');
}

function hasWorldLinkRuleElement(action) {
    return action?.system?.rules?.some(rule =>
        !rule.uuid?.startWith('Compendium') ||
        rule?.effects?.some(effect =>
            effect?.uuid &&
            effect?.uuid?.startWith('Compendium')
        )
    )
}

function getWorldLinkRuleElementIDXs(action) {
    const rules = action?.system?.rules;
    if (!rules) return [];

    return rules
        .map((rule, index) => {
            const hasWorldLink = !rule.uuid?.startsWith('Compendium') ||
                rule?.effects?.some(effect =>
                    effect?.uuid &&
                    effect?.uuid?.startsWith('Compendium')
                );

            // Return the index if it meets criteria, otherwise null
            return hasWorldLink ? index : null;
        })
        .filter(index => index !== null); // Remove null values
}