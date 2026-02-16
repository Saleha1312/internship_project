document.getElementById("extract").addEventListener("click", () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      },
      (results) => {
        if (chrome.runtime.lastError) {
          document.getElementById("output").value =
            chrome.runtime.lastError.message;
          return;
        }

        if (results && results[0] && results[0].result) {
          document.getElementById("output").value =
          JSON.stringify(results[0].result, null, 2);
    }
    });
  });
});
