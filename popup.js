document.getElementById("extract").addEventListener("click", () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: startRealtimeExtraction
      },
      (results) => {
        if (chrome.runtime.lastError) {
          document.getElementById("output").value =
            chrome.runtime.lastError.message;
          return;
        }

        document.getElementById("output").value =
          JSON.stringify(results[0].result, null, 2);
          // Send to backend API
      // try {
      //   const apiResponse = fetch('http://localhost:8000/api/store-data', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(response)
      //   });
        
      //   if (apiResponse.ok) {
      //     let status
      //     status.textContent = 'Data saved successfully!';
      //   } else {
      //     status.textContent = 'Failed to save data';
      //   }
      // } catch (error) {
      //   status.textContent = 'Error connecting to backend';
      // }
    });
  });
});
/* ================= CORE EXTRACTION ================= */

function startRealtimeExtraction() {

  function extractCleanPageData() {

    // Choose meaningful container
    const selectors = ["main", "#content", ".content", ".dashboard", "body","charts"];
    let container = null;

    for (let s of selectors) {
      container = document.querySelector(s);
      if (container) break;
    }

    if (!container) return [];
   let clone = container.cloneNode(true);

    // Remove UI / operators
    clone.querySelectorAll(
      "nav, header, footer, button, input, select, textarea, form, script, style"
    ).forEach(e => e.remove());

    // DO NOT remove svg → chart labels live here
    // DO NOT remove canvas → text around charts still exists

    let lines = clone.innerText
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 2);

    // Remove common UI keywords
    const blacklist = [
      "login", "sign", "submit", "click", "filter", "search",
      "menu", "home", "settings", "help", "logout"
    ];

    return lines.filter(l => {
      let lower = l.toLowerCase();
      return !blacklist.some(b => lower.includes(b));
    });
  }

  /* ========== REAL-TIME OBSERVER ========== */

  let latestData = extractCleanPageData();

  const observer = new MutationObserver(() => {
    latestData = extractCleanPageData();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  return {
    status: "real-time extraction started",
    data: latestData
  };
}