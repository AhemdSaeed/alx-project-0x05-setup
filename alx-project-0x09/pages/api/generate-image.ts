import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const gptUrl = "https://chatgpt-42.p.rapidapi.com/texttoimage";

  if (!gptApiKey || !gptUrl) {
    return res.status(500).json({ error: "API key or URL is missing" });
  }

  try {
    const { prompt }: RequestProps = req.body;

    const dalleResponse = await fetch(gptUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "x-rapidapi-key": gptApiKey,
      },
      body: JSON.stringify({
        text: prompt,
        width: WIDTH,
        height: HEIGHT,
      }),
    });

    if (!dalleResponse.ok) {
      throw new Error("Failed to fetch from GPT API");
    }

    const data = await dalleResponse.json();

    return res.status(200).json({
      message: data?.generated_image || "https://via.placeholder.com/512x512.png?text=No+Image",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
