function startRealtimeExtraction() {
  console.log("startRealtimeExtraction called.");

  function extractCleanPageData() {
    console.log("extractCleanPageData called.");
    // Choose meaningful container
    const selectors = ["main", "#content", ".content", ".dashboard", "body"];
    let container = null;
    for (let s of selectors) {
      container = document.querySelector(s);
      if (container) {
        console.log("Found container:", s);
        break;
      }
    }
    if (!container) {
      console.log("No container found.");
      return [];
    }

    // Clone so page is untouched
    let clone = container.cloneNode(true);

    // Remove UI / operators
    clone.querySelectorAll(
      "nav, header, footer, button, input, select, textarea, form, script, style"
    ).forEach(e => e.remove());

    let lines = clone.innerText
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 2);
    console.log("Extracted lines:", lines);


    // Remove common UI keywords
    const blacklist = [
      "login", "sign", "submit", "click", "filter", "search",
      "menu", "home", "settings", "help", "logout"
    ];

    const filteredLines = lines.filter(l => {
      let lower = l.toLowerCase();
      return !blacklist.some(b => lower.includes(b));
    });
    console.log("Filtered lines:", filteredLines);
    return filteredLines;
  }

  function extractGraphData() {
    console.log("extractGraphData called.");
    let charts = [];
    if (window.Chart && Chart.instances) {
      Object.values(Chart.instances).forEach(chart => {
        charts.push({
          type: chart.config.type,
          labels: chart.data.labels,
          values: chart.data.datasets[0].data
        });
      });
    }
    console.log("Extracted charts:", charts);
    return charts;
  }

  /* ========== REAL-TIME OBSERVER ========== */
  let latestData = {
    text: extractCleanPageData(),
    charts: extractGraphData()
  };
  console.log("Initial extracted data:", latestData);


  const observer = new MutationObserver(() => {
    console.log("Mutation observer triggered.");
    latestData = {
      text: extractCleanPageData(),
      charts: extractGraphData()
    };
    console.log("Updated data:", latestData);
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
// changes start here
chrome.runtime.sendMessage({
  type: "SEND_TO_BACKEND",
  extracteddata: latestData
});