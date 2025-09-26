export function setupDevHighlightActionsWorldLink(active) {
    if (active) {
        Hooks.on("renderActorSheetPF2e", renderActorSheetPF2e)
        Hooks.on("renderItemSheetPF2e", renderItemSheetPF2e)
    } else {
        Hooks.off("renderActorSheetPF2e", renderActorSheetPF2e)
        Hooks.off("renderItemSheetPF2e", renderItemSheetPF2e)
    }
}

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
    const actualHTML = html?.[0];

    if (hasWorldLinkDescription(action)) {
        styleTab('description', actualHTML)

        const contentLinks = actualHTML
            .querySelectorAll('.sheet-body .content-link[data-uuid]');
        contentLinks.forEach(link => {
            const uuid = link.getAttribute('data-uuid');
            if (uuid && !uuid.startsWith('Compendium')) {
                link.classList.add(tag);
            }
        });
    }

    if (hasWorldLinkSelfEffect(action)) {
        styleTab('details', actualHTML)

        const selfEffect = actualHTML
            .querySelector('.form-group[data-drop-zone="self-applied-effect"]')
        selfEffect.classList.add(tag)
    }

    if (hasWorldLinkRuleElement(action)) {
        styleTab('rules', actualHTML)
        const relevantRulesIDXs = new Set(getWorldLinkRuleElementIDXs(action))

        const elements = actualHTML.querySelectorAll('section.rule-form');
        elements.forEach(element => {
            const itemId = Number(element.getAttribute('data-idx'));
            if (relevantRulesIDXs.has(itemId)) {
                element.classList.add(tag);
            }
        });
    }
}

function styleTab(tab, actualHTML) {
    const tabHTML = actualHTML
        .querySelector(`.sheet-tabs .tabs a.list-row[data-tab="${tab}"]`)
    tabHTML.classList.add(tag)
}

function hasWorldLinkDescription(action) {
    return !!action?.system?.description?.value.match(regexWorldLink);
}

function hasWorldLinkSelfEffect(action) {
    return !!action?.system?.selfEffect?.uuid &&
        !action?.system?.selfEffect?.uuid?.startsWith('Compendium');
}

function hasWorldLinkRuleElement(action) {
    return action?.system?.rules?.some(rule =>
        (rule?.uuid && !rule.uuid?.startsWith('Compendium')) ||
        rule?.effects?.some(effect =>
            effect?.uuid &&
            !effect?.uuid?.startsWith('Compendium')
        )
    )
}

function getWorldLinkRuleElementIDXs(action) {
    const rules = action?.system?.rules;
    if (!rules) return [];

    return rules
        .map((rule, index) => {
            const hasWorldLink =
                (rule?.uuid && !rule.uuid?.startsWith('Compendium')) ||
                rule?.effects?.some(effect =>
                    effect?.uuid &&
                    effect?.uuid?.startsWith('Compendium')
                );
            return hasWorldLink ? index : null;
        })
        .filter(index => index !== null);
}