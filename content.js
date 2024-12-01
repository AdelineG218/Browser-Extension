let popup = null;

// Create a popup for translations
function createPopup(text, x, y) {
    if (popup) document.body.removeChild(popup);

    popup = document.createElement("div");
    popup.style.position = "absolute";
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.background = "#f1f1f1";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.borderRadius = "5px";
    popup.style.zIndex = 1000;
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    popup.textContent = text;

    document.body.appendChild(popup);
    console.log("Popup created")
}

// Fetch translation
async function fetchTranslation(text, targetLang = "en") {
    const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            q: text,
            source: "auto", // Detects the source language automatically
            target: targetLang,
        }),
    });
    const data = await response.json();
    return data.translatedText;
}

// Event listener for hover and Shift
document.addEventListener("mouseover", (e) => {
  const target = e.target;

  if (target && target.innerText.trim()) {
    let hoveredText = target.innerText;

    document.addEventListener("keydown", async (event) => {
      if (event.key === "Shift" && hoveredText) {
        console.log("Event match!")
        const translation = await fetchTranslation(hoveredText);
        createPopup(translation, e.pageX + 10, e.pageY + 10);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "Shift" && popup) {
        document.body.removeChild(popup);
        popup = null;
      }
    });
  }
});
