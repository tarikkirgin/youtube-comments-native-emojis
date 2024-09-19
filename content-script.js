let observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      for (let addedNode of mutation.addedNodes) {
        processNode(addedNode);
      }
    } else if (mutation.type === "attributes") {
      const target = mutation.target;
      if (
        target.nodeName === "IMG" &&
        target.classList.contains("yt-core-attributed-string__image-element") &&
        mutation.attributeName === "src"
      ) {
        processNode(target);
      }
    }
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src"],
});

function processNode(node) {
  if (
    node.nodeName !== "IMG" ||
    !node.classList.contains("yt-core-attributed-string__image-element")
  ) {
    return;
  }

  if (node.src) {
    const emojiCode = extractEmojiCode(node.src);
    if (emojiCode) {
      replaceWithEmoji(node.parentNode, emojiCode);
    }
  }
}

function extractEmojiCode(imageSrc) {
  const match = imageSrc.match(/emoji_u([0-9a-fA-F_]+)\.png/);

  if (match) {
    const codePoints = match[1].split("_").map((code) => parseInt(code, 16));
    return String.fromCodePoint(...codePoints);
  }

  return null;
}

function replaceWithEmoji(node, emoji) {
  node.replaceWith(document.createTextNode(emoji));
}
