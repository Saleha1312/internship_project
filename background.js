chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "SEND_TO_BACKEND") {
    console.log("FETCH FUNCTION CALLED");
    fetch("http://localhost:8000/api/store-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message.extracteddata)
    })
    .then(res => res.json())
    .then(data => console.log("Backend response:", data))
    .catch(err => console.error("Fetch error:", err));
  }
}); 