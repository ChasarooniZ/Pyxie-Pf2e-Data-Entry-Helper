export function getAllFolderChildren(folder) {
  const children = folder.contents;
  for (const child of folder.children) {
    children.push(...child.entries);
    for (const child2 of child.children) {
      children.push(...child2.entries);
    }
  }
  return children;
}
