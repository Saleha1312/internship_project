console.log("Background script loaded");

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "SEND_TO_BACKEND") {
    console.log("FETCH FUNCTION CALLED", message.extracteddata);

    // Clean data to avoid JSON errors
    const cleanData = JSON.parse(
      JSON.stringify(message.extracteddata)
    );

    const payload = {
      data: cleanData
    };

    console.log("Sending payload:", payload);

    fetch("http://localhost:8000/api/store-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      console.log("Status:", res.status);
      return res.json();
    })
    .then(data => console.log("Backend response:", data))
    .catch(err => console.error("Fetch error:", err));
  }
});