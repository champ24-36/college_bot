export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { message } = req.body;

    const websiteContext = `
Gayatri Vidya Parishad College of Engineering for Women (GVPCEW)
is located in Visakhapatnam, Andhra Pradesh.

Departments offered:
- Computer Science and Engineering (CSE)
- CSE (Artificial Intelligence & Machine Learning)
- Electronics and Communication Engineering (ECE)
- Electrical and Electronics Engineering (EEE)

Admissions:
- Category A: Through APEAPCET
- Category B: Management quota

Facilities:
- Central Library
- Computer Labs
- Hostel
- Transportation
- Sports facilities
- Placement Cell

Contact:
Email: info@gvpcew.ac.in
Location: Visakhapatnam - 530048, Andhra Pradesh

Only answer strictly from this information.
If information is not found here, reply:
"This information is not available on the official college website."
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
