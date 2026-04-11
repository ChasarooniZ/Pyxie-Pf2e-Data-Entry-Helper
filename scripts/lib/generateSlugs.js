// function addGenerateSlugsActorContextOption(contextOptions) {
//   if (!game.user.isGM) {
//     return;
//   }

//   contextOptions.push({
//     name: "Regenerate Slug",
//     callback: (li) => {
//       const docId =
//         li.dataset?.entryId ??
//         li.dataset?.documentId ??
//         li.dataset?.actorId ??
//         li.dataset?.entityId ??
//         li.getAttribute("data-entry-id") ??
//         li.getAttribute("data-document-id") ??
//         li.getAttribute("data-actor-id") ??
//         li.getAttribute("data-entity-id");
//       if (docId) {
//         const doc = game.actors.get(docId);
//         regenerateSlug(doc, 'actor')
//       }
//     },
//     icon: '<i class="fas fa-user-circle"></i>',
//     condition: () => {
//       return game.user.isGM;
//     },
//   });
// }

function addGenerateSlugsitemContextOption(contextOptions) {
  if (!game.user.isGM) {
    return;
  }

  contextOptions.push({
    name: "Regenerate Slug",
    callback: (li) => {
      const docId =
        li.dataset?.entryId ??
        li.dataset?.documentId ??
        li.dataset?.itemId ??
        li.dataset?.entityId ??
        li.getAttribute("data-entry-id") ??
        li.getAttribute("data-document-id") ??
        li.getAttribute("data-item-id") ??
        li.getAttribute("data-entity-id");
      if (docId) {
        const doc = game.items.get(docId);
        regenerateSlug(doc, 'item')
      }
    },
    icon: '<i class="fas fa-user-circle"></i>',
    condition: () => {
      return game.user.isGM;
    },
  });
}

async function regenerateSlug(doc, type) {
  switch (type) {
    case "item":
      await doc.update({
        system: { slug: game.pf2e.system.sluggify(doc.name) },
      });
  }
}
