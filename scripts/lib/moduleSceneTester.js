export async function moduleSceneTester() {
  // Add dialogue to the beginning
  // set this window.pyxieFileTestModulePath
  // use this for logging
  const relevantLayers = ["sounds", "walls", "tiles"];
  const activeLayerID = canvas.activeLayer.options.name;
  const duration = 30;
  const modules = game.modules
    .filter((m) => m.active)
    .map((module) => ({ id: module.id, name: module.title }));
  modules.unshift({ id: "", name: "---" });
  let data;
  try {
    data = await foundry.applications.api.DialogV2.prompt({
      window: {
        title: game.i18n.localize("pyxie.dialog.module-scene-tester.title"),
      },
      content: `
    <p>${game.i18n.localize("pyxie.dialog.module-scene-tester.description")}</p>
    <label id="moduleid">${game.i18n.localize("pyxie.dialog.module-scene-tester.inputs.module-selector")}</label>
    <select name="Module ID" id="moduleid">
      ${modules.map((m) => `<option value="${m.id}" ${window?.pyxieFileTestModulePath === m.id ? "selected" : ""}>${m.name}</option>`)}
    </select>
    <label id="moduleid">${game.i18n.localize("pyxie.dialog.module-scene-tester.inputs.test-all-scenes")}</label>
    <input type="checkbox" id="allscenes" name="Test All Scenes" ${window?.pyxieTestAll ? "checked" : ""}/>
    <label id="nosuccess">${game.i18n.localize("pyxie.dialog.module-scene-tester.inputs.dont-show-success")}</label>
    <input type="checkbox" id="nosuccess" name="Don't Show Succeeded"  ${window?.pyxieDontShowSuccess ? "checked" : ""}/>
    ${relevantLayers.includes(activeLayerID) ? `<p><i class="fa-solid fa-circle-info"></i> <i>${game.i18n.format("pyxie.dialog.module-scene-tester.one-layer-note", { activeLayerID })}</i></p>` : ""}
    `,
      ok: {
        label: game.i18n.localize("pyxie.dialog.module-scene-tester.buttons.test"),
        callback: (event, button, dialog) => ({
          moduleid: button.form.elements.moduleid.value,
          allscenes: button.form.elements.allscenes.checked,
          nosuccess: button.form.elements.nosuccess.checked,
        }),
      },
    });
    console.log(data);
  } catch {
    console.log("Closed Dialog");
    return;
  }
  const { moduleid, allscenes, nosuccess } = data;
  window.pyxieFileTestModulePath = moduleid;
  window.pyxieTestAll = allscenes;
  window.pyxieDontShowSuccess = nosuccess;

  function testPath(path) {
    return !path?.startsWith(
      `modules/${window.pyxieFileTestModulePath ? window.pyxieFileTestModulePath : ""}`,
    );
  }

  const scenes = allscenes ? game.scenes.contents : [canvas.scene];

  for (const scene of scenes) {
    let errors = [];
    console.log(
      `============Testing scene "${scene.name}" file paths=============`,
    );

    if (scene.foreground && testPath(scene.foreground)) {
      console.log(
        `${game.i18n.localize("SCENE.FIELDS.background.src.label")} ${game.i18n.localize("pyxie.issues.issue")}`,
        scene.foreground,
      );
      errors.push({
        type: `${game.i18n.localize("SCENE.FIELDS.background.src.label")} ${game.i18n.localize("pyxie.issues.issue")}`,
        id: null,
        path: scene.foreground,
      });
    }

    if (scene.background.src && testPath(scene.background.src)) {
      console.log(
        `${game.i18n.localize("SCENE.FIELDS.foreground.label")} ${game.i18n.localize("pyxie.issues.issue")}`,
        scene.background.src,
      );
      errors.push({
        type: `${game.i18n.localize("SCENE.FIELDS.foreground.label")} ${game.i18n.localize("pyxie.issues.issue")}`,
        id: null,
        path: scene.background.src,
      });
    }

    if (relevantLayers.includes(activeLayerID) && activeLayerID === "tiles") {
      for (const tile of canvas.scene.tiles.contents) {
        let tilePath = tile.texture.src;
        if (testPath(tilePath)) {
          console.log(
            `${game.i18n.localize("DOCUMENT.Tile")} ${game.i18n.localize("pyxie.issues.issue")}`,
            `[${game.i18n.localize("pyxie.issues.id")}:`,
            tile.id,
            "]",
            tilePath,
          );
          errors.push({
            type: `${game.i18n.localize("DOCUMENT.Tile")} ${game.i18n.localize("pyxie.issues.issue")}`,
            id: tile.id,
            path: tilePath,
          });
          canvas.ping(
            {
              x: tile.x + tile.width / 2,
              y: tile.y + tile.height / 2,
            },
            {
              duration: duration * 1000,
              size: Math.min(tile.width, tile.height),
              type: "alert",
            },
          );
        }
      }
    }

    if (relevantLayers.includes(activeLayerID) && activeLayerID === "walls") {
      for (const wall of canvas.scene.walls.contents) {
        let wallPath = wall?.animation?.texture;
        if (wallPath && testPath(wallPath)) {
          console.log(
            `${game.i18n.localize("DOCUMENT.Wall")} ${game.i18n.localize("pyxie.issues.issue")}`,
            `[${game.i18n.localize("pyxie.issues.id")}:`,
            wall.id,
            "]",
            wallPath,
          );
          errors.push({
            type: `${game.i18n.localize("DOCUMENT.Wall")} ${game.i18n.localize("pyxie.issues.issue")}`,
            id: wall.id,
            path: wallPath,
          });
          const distance = new Ray(
            { x: wall.c[0], y: wall.c[1] },
            { x: wall.c[2], y: wall.c[3] },
          ).distance;
          canvas.ping(
            {
              x:
                Math.min(wall.c[0], wall.c[2]) +
                Math.abs(wall.c[2] - wall.c[0]) / 2,
              y:
                Math.min(wall.c[1], wall.c[3]) +
                Math.abs(wall.c[3] - wall.c[1]) / 2,
            },
            { duration: duration * 1000, size: distance, type: "alert" },
          );
        }
      }
    }

    if (relevantLayers.includes(activeLayerID) && activeLayerID === "sounds") {
      for (const sound of canvas.scene.sounds.contents) {
        let soundPath = sound?.path;
        if (soundPath && testPath(soundPath)) {
          console.log(
            `${game.i18n.localize("DOCUMENT.AmbientSound")} ${game.i18n.localize("pyxie.issues.issue")}`,
            `[${game.i18n.localize("pyxie.issues.id")}:`,
            sound.id,
            "]",
            soundPath,
          );
          errors.push({
            type: `${game.i18n.localize("DOCUMENT.AmbientSound")} ${game.i18n.localize("pyxie.issues.issue")}`,
            id: sound.id,
            path: soundPath,
          });
          canvas.ping(sound, {
            duration: duration * 1000,
            size: canvas.grid.size,
            type: "alert",
          });
        }
      }
    }

    if (errors.length > 0) {
      ui.notifications.error(
        `<b>❌ ${game.i18n.localize("pyxie.issues.result.failure")} '${scene.name}'</b>
    <br>
    ${errors.map((err) => `${err.type} ${err.id ? `[${game.i18n.localize("pyxie.issues.id")}: <code>${err.id}</code>]` : ""} <code>${err.path}</code>`).join("<br>")}
    `,
        { permanent: true, console: false },
      );
    } else if (!nosuccess) {
      ui.notifications.info(
        `✔ ${game.i18n.localize("pyxie.issues.result.success")} ${scene.name}`,
      );
    }
  }
  console.log("End of File Paths Test");
}
