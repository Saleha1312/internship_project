// function startRealtimeExtraction() {
//   console.log("startRealtimeExtraction called.");

//   function extractCleanPageData() {
//     console.log("extractCleanPageData called.");
//     // Choose meaningful container
//     const selectors = ["main", "#content", ".content", ".dashboard", "body"];
//     let container = null;
//     for (let s of selectors) {
//       container = document.querySelector(s);
//       if (container) {
//         console.log("Found container:", s);
//         break;
//       }
//     }
//     if (!container) {
//       console.log("No container found.");
//       return [];
//     }

//     // Clone so page is untouched
//     let clone = container.cloneNode(true);

//     // Remove UI / operators
//     clone
//       .querySelectorAll(
//         "nav, header, footer, button, input, select, textarea, form, script, style",
//       )
//       .forEach((e) => e.remove());

//     let lines = clone.innerText
//       .split("\n")
//       .map((t) => t.trim())
//       .filter((t) => t.length > 2);
//     console.log("Extracted lines:", lines);

//     // Remove common UI keywords
//     const blacklist = [
//       "login",
//       "sign",
//       "submit",
//       "click",
//       "filter",
//       "search",
//       "menu",
//       "home",
//       "settings",
//       "help",
//       "logout",
//     ];

//     const filteredLines = lines.filter((l) => {
//       let lower = l.toLowerCase();
//       return !blacklist.some((b) => lower.includes(b));
//     });
//     console.log("Filtered lines:", filteredLines);
//     return filteredLines;
//   }

//   function extractGraphData() {
//     console.log("extractGraphData called.");
//     let charts = [];
//     if (window.Chart && Chart.instances) {
//       Object.values(Chart.instances).forEach((chart) => {
//         charts.push({
//           type: chart.config.type,
//           labels: chart.data.labels,
//           values: chart.data.datasets[0].data,
//         });
//       });
//     }
//     console.log("Extracted charts:", charts);
//     return charts;
//   }

//   let latestData = {
//     text: extractCleanPageData(),
//     charts: extractGraphData(),
//   };
//   const observer = new MutationObserver(() => {
//     console.log("Mutation observer triggered.");
//       latestData = {
//         text: extractCleanPageData(),
//         charts: extractGraphData(),
//     };
//     console.log("Updated data:", latestData);
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//     characterData: true,
//   });

//   const payload = {
//     url: window.location.href,
//     title: document.title,
//     extraction_type: "full_page",
//     full_text: latestData.text.join("\n"),
//     structured_data: {
//       lists: [latestData.text],
//       tables: [],
//     },
//     graph_data: latestData.charts,
//     metadata: {
//       headings: [],
//       links: [],
//       images: [],
//     },
//   };

//   console.log("Sending payload to backend:", payload);

//   // const result = startRealtimeExtraction();

//   chrome.runtime.sendMessage({
//     type: "SEND_TO_BACKEND",
//     extracteddata: payload,
//   });

//   return {
//     status: "real-time extraction started",
//     data: latestData,
//   };
// }
// startRealtimeExtraction();

// changes made here
// function startRealtimeExtraction() {
//   console.log("startRealtimeExtraction called.");

//   function extractCleanPageData() {
//     console.log("extractCleanPageData called.");
//     // Choose meaningful container
//     const selectors = ["main", "#content", ".content", ".dashboard", "body"];
//     let container = null;
//     for (let s of selectors) {
//       container = document.querySelector(s);
//       if (container) {
//         console.log("Found container:", s);
//         break;
//       }
//     }
//     if (!container) {
//       console.log("No container found.");
//       return [];
//     }

//     // Clone so page is untouched
//     let clone = container.cloneNode(true);

//     // Remove UI / operators
//     clone
//       .querySelectorAll(
//         "nav, header, footer, button, input, select, textarea, form, script, style",
//       )
//       .forEach((e) => e.remove());

//     let lines = clone.innerText
//       .split("\n")
//       .map((t) => t.trim())
//       .filter((t) => t.length > 2);
//     console.log("Extracted lines:", lines);

//     // Remove common UI keywords
//     const blacklist = [
//       "login",
//       "sign",
//       "submit",
//       "click",
//       "filter",
//       "search",
//       "menu",
//       "home",
//       "settings",
//       "help",
//       "logout",
//     ];

//     const filteredLines = lines.filter((l) => {
//       let lower = l.toLowerCase();
//       return !blacklist.some((b) => lower.includes(b));
//     });
//     console.log("Filtered lines:", filteredLines);
//     return filteredLines;
//   }

//   function extractGraphData() {
//     console.log("extractGraphData called.");
//     let charts = [];
//     if (window.Chart && Chart.instances) {
//       Object.values(Chart.instances).forEach((chart) => {
//         charts.push({
//           type: chart.config.type,
//           labels: chart.data.labels,
//           values: chart.data.datasets[0].data,
//         });
//       });
//     }
//     console.log("Extracted charts:", charts);
//     return charts;
//   }

//   let latestData = {
//     text: extractCleanPageData(),
//     charts: extractGraphData(),
//   };

//   let debouncedTimer;

//   const observer = new MutationObserver(() => {
//     console.log("Mutation observer triggered.");

//     clearTimeout(debouncedTimer);

//     debouncedTimer = setTimeout(() => {
//       latestData = {
//         text: extractCleanPageData(),
//         charts: extractGraphData(),
//       };
//       //console.log("Updated data:", latestData);

//       const payload = {
//         url: window.location.href,
//         title: document.title,
//         extraction_type: "full_page",
//         full_text: latestData.text.join("\n"),
//         structured_data: {
//           lists: [latestData.text],
//           tables: [],
//         },
//         graph_data: latestData.charts,
//         metadata: {
//           headings: [],
//           links: [],
//           images: [],
//         },
//       };

//       console.log("Sending payload to backend:", payload);

//       // const result = startRealtimeExtraction();

//       chrome.runtime.sendMessage({
//         type: "SEND_TO_BACKEND",
//         extracteddata: payload,
//       });
//     }, 2000);
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });

//   return {
//     status: "real-time extraction started",
//     data: latestData,
//   };
// }

// startRealtimeExtraction();


// 2nd change
function startRealtimeExtraction() {  
  console.log("startRealtimeExtraction called.");  
  
  function extractCleanPageData() {  
    console.log("extractCleanPageData called.");  
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
  
    let clone = container.cloneNode(true);  
  
    clone  
      .querySelectorAll(  
        "nav, header, footer, button, input, select, textarea, form, script, style"  
      )  
      .forEach((e) => e.remove());  
  
    let lines = clone.innerText  
      .split("\n")  
      .map((t) => t.trim())  
      .filter((t) => t.length > 2);  
  
    const blacklist = [  
      "login","sign","submit","click","filter","search",  
      "menu","home","settings","help","logout",  
    ];  
  
    const filteredLines = lines.filter((l) => {  
      let lower = l.toLowerCase();  
      return !blacklist.some((b) => lower.includes(b));  
    });  
  
    return filteredLines;  
  }  
  
  function extractGraphData() {  
    console.log("extractGraphData called.");  
    let charts = [];  
    if (window.Chart && Chart.instances) {  
      Object.values(Chart.instances).forEach((chart) => {  
        charts.push({  
          type: chart.config.type,  
          labels: chart.data.labels,  
          values: chart.data.datasets[0].data,  
        });  
      });  
    }  
    return charts;  
  }  
  
  let latestData = {  
    text: extractCleanPageData(),  
    charts: extractGraphData(),  
  };  
  
  let debouncedTimer;  
  
  const observer = new MutationObserver(() => {  
    console.log("Mutation observer triggered.");  
  
    clearTimeout(debouncedTimer);  
  
    debouncedTimer = setTimeout(() => {  
      latestData = {  
        text: extractCleanPageData(),  
        charts: extractGraphData(),  
      };  
  
      const payload = {  
        url: window.location.href,  
        title: document.title,  
        extraction_type: "full_page",  
        full_text: latestData.text.join("\n"),  
        structured_data: {  
          lists: [latestData.text],  
          tables: [],  
        },  
        graph_data: latestData.charts,  
        metadata: {  
          headings: [],  
          links: [],  
          images: [],  
        },  
      };  
  
      console.log("Sending payload to backend:", payload);  
  
      chrome.runtime.sendMessage({  
        type: "SEND_TO_BACKEND",  
        extracteddata: payload,  
      });  
    }, 2000);  
  });  
  
  observer.observe(document.body, {  
    childList: true,  
    subtree: true,  
  });  

  // ✅ INITIAL SEND (added block)
  chrome.runtime.sendMessage({  
    type: "SEND_TO_BACKEND",  
    extracteddata: {  
      url: window.location.href,  
      title: document.title,  
      extraction_type: "full_page",  
      full_text: latestData.text.join("\n"),  
      structured_data: { lists: [latestData.text], tables: [] },  
      graph_data: latestData.charts,  
      metadata: { headings: [], links: [], images: [] },  
    },  
  });  
  
  return {  
    status: "real-time extraction started",  
    data: latestData,  
  };  
}  
  
startRealtimeExtraction();
