export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  const websiteContext = `
  Gayatri Vidya Parishad College of Engineering for Women (GVPCEW)
  located in Visakhapatnam, Andhra Pradesh.

  Offers undergraduate programs:
  - Computer Science & Engineering
  - CSE (AI & ML)
  - Cyber Security
  - Electronics & Communication Engineering
  - Electrical & Electronics Engineering

  Admissions through APEAPCET (Category A) and Management quota (Category B).
  Fees vary by category and branch as listed on official site.

  College includes facilities such as:
  - Library
  - Laboratories
  - Hostel
  - Sports
  - Transport
  - Placement Cell

  Contact:
  Email: info@gvpcew.ac.in
  Location: Visakhapatnam - 530048, Andhra Pradesh

  Only answer from this information.
  If answer not found, say:
  "This information is not available on the official college website."
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error.";

  res.status(200).json({ reply });
}
