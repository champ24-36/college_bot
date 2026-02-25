export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { message } = req.body;

    const websiteContext = `
    Gayatri Vidya Parishad College of Engineering for Women
    located in Visakhapatnam, Andhra Pradesh.
    Only answer from this information.
    `;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: websiteContext + "\nUser Question: " + message
            }]
          }]
        })
      }
    );

    const data = await geminiResponse.json();

    console.log("Gemini Full Response:", data);

    if (!data.candidates) {
      return res.status(500).json({
        reply: "Gemini Error: " + JSON.stringify(data)
      });
    }

    const reply = data.candidates[0].content.parts[0].text;

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Server error occurred." });
  }
}
