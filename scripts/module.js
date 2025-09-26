import { setupDevHighlightActionsNoCategory } from "./lib/noCategoryHighlight.js";
import { setupDevHighlightActionsWorldLink } from "./lib/worldLinkHighlight.js";

Hooks.once('init', async function () {

});

Hooks.once('ready', async function () {
    setupDevHighlightActionsNoCategory(true)
    setupDevHighlightActionsWorldLink(true)
});

