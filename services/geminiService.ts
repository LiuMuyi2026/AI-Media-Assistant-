import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisRequest, AnalysisResult, ScriptRequest, ScriptResult, ImageGenerationRequest, ImageGenerationResult } from "../types";

// Helper to sanitize the result
const cleanText = (text: string) => text.trim();

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMedia = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  const ai = getAIClient();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "The main summary of the content. Must be detailed and include data points, statistics, and emotional hooks.",
      },
      originalContent: {
        type: Type.STRING,
        description: "The FULL, VERBATIM transcript or article text. Do not summarize or shorten this field.",
      },
      commentsSummary: {
        type: Type.STRING,
        description: "A summary of the comments/discussion, focusing on corrections and insightful additions. Return 'N/A' if not requested or found.",
      },
    },
    required: ["summary", "originalContent"],
  };

  const prompt = `
    You are an expert AI Media Assistant. Your task is to analyze the content at the provided URL.
    
    Target URL: ${request.url}
    
    Configuration:
    1. Output Language: ${request.language}
    2. Summary Detail Level: ${request.conciseness}
    3. Analyze Comments: ${request.includeComments ? "YES" : "NO"}

    Instructions:
    1. Use the Google Search tool to find the FULL content of the URL.
    2. **Summary**: Generate a structured summary based on the 'Detail Level'. 
       - **Word Count Targets**:
         * Brief: ~500 words.
         * Moderate: ~1000 words.
         * Detailed: ~2000+ words.
       - CRITICAL: Do NOT omit specific data, numbers, statistics, or key facts.
       - CRITICAL: Capture content that is designed to evoke emotion or audience reaction.
    3. **Original Content**: EXTRACT THE FULL TRANSCRIPT OR ARTICLE TEXT VERBATIM.
       - **DO NOT SUMMARIZE**. 
       - **DO NOT SHORTEN**. 
       - **DO NOT PARAPHRASE**.
       - If it is a video, provide the complete spoken transcript.
       - If it is an article, provide the full body text.
    4. **Comments**: If 'Analyze Comments' is YES, look for user comments or discussions related to this content.
       - Focus specifically on comments that CORRECT errors in the original content.
       - Highlight "brilliant" or highly upvoted insights.
       - If 'Analyze Comments' is NO, leave this field empty or "N/A".
    
    Return the result in JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response generated from Gemini.");

    const parsed = JSON.parse(resultText);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingUrls = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string | undefined): uri is string => !!uri);

    return {
      summary: cleanText(parsed.summary),
      originalContent: cleanText(parsed.originalContent),
      commentsSummary: request.includeComments ? cleanText(parsed.commentsSummary || "No comments found.") : undefined,
      groundingUrls: Array.from(new Set(groundingUrls)),
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze media.");
  }
};

export const generateVideoScript = async (request: ScriptRequest): Promise<ScriptResult> => {
  const ai = getAIClient();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      titles: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3-5 Viral, clickable titles.",
      },
      hook: {
        type: Type.STRING,
        description: "The opening 3-5 seconds script designed to grab attention immediately.",
      },
      scriptBody: {
        type: Type.STRING,
        description: "The main content script, structured with visual cues in brackets [Visual: ...].",
      },
      closing: {
        type: Type.STRING,
        description: "The outro and Call to Action (CTA).",
      },
      description: {
        type: Type.STRING,
        description: "Optimized video description with hashtags.",
      },
      strategy: {
        type: Type.STRING,
        description: "Explanation of why this script works (psychological hooks, retention strategy).",
      },
      factCheckReport: {
        type: Type.STRING,
        description: "If fact check enabled: A report on the accuracy of claims using search. If disabled: 'N/A'.",
      },
      safetyReport: {
        type: Type.STRING,
        description: "If safety check enabled: A report on suitability/policy compliance. If disabled: 'N/A'.",
      }
    },
    required: ["titles", "hook", "scriptBody", "closing", "description", "strategy"],
  };

  const prompt = `
    You are a professional viral video strategist and scriptwriter. 
    Create a script based on the following requirements:

    **Topic**: ${request.topic}
    **Target Styles**: ${request.styles.join(", ")}
    **Custom Inspiration/Instructions**: ${request.customInstructions || "None provided."}
    **Target Length/Duration**: ${request.duration}
    **Output Language**: ${request.language}
    **Perform Safety Check**: ${request.safetyCheck ? "YES" : "NO"}
    **Perform Fact Check**: ${request.factCheck ? "YES - Use Google Search to verify claims" : "NO"}

    **Instructions**:
    1. **Titles**: Generate 3-5 high CTR (Click-Through Rate) titles.
    2. **Hook**: Create a scroll-stopping hook (first 3 seconds).
    3. **Content**: Write the script body. Use the selected 'Styles' tone. 
       - INCORPORATE the 'Custom Inspiration/Instructions' if provided.
       - Include visual cues in brackets, e.g., [Cut to b-roll of...].
    4. **Strategy**: Explain the psychological triggers used.
    5. **Fact Check**: If enabled, use Google Search to verify any objective claims in your generated script. Report any potential inaccuracies or confirm validity.
    6. **Safety**: If enabled, analyze if the content might violate common platform policies (YouTube/TikTok/Instagram) regarding hate speech, violence, or dangerous acts.

    Return JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: request.factCheck ? [{ googleSearch: {} }] : [],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No script generated.");

    const parsed = JSON.parse(resultText);

    return {
      titles: parsed.titles,
      hook: cleanText(parsed.hook),
      scriptBody: cleanText(parsed.scriptBody),
      closing: cleanText(parsed.closing),
      description: cleanText(parsed.description),
      strategy: cleanText(parsed.strategy),
      factCheckReport: request.factCheck ? cleanText(parsed.factCheckReport) : undefined,
      safetyReport: request.safetyCheck ? cleanText(parsed.safetyReport) : undefined,
    };

  } catch (error: any) {
    console.error("Script Generation Error:", error);
    throw new Error(error.message || "Failed to generate script.");
  }
};

export const generateSocialImages = async (request: ImageGenerationRequest): Promise<ImageGenerationResult> => {
  const ai = getAIClient();

  const generatedImages: { base64: string; mimeType: string }[] = [];
  let generatedCaption = "";

  // Helper to generate a single image
  const generateSingleImage = async () => {
    const prompt = `
      Create a high-quality ${request.style} style image.
      Subject: ${request.prompt}.
      Ensure the composition is suitable for a social media cover.
      ${request.generateCaption ? "Also, generate a short, engaging caption for this image suitable for social media." : ""}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: request.ratio,
        },
      },
    });

    // Extract Image
    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart?.inlineData?.data) {
      generatedImages.push({
        base64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType || 'image/png',
      });
    }

    // Extract Text (only need to do this once effectively, but the model might output it every time)
    // We'll capture the last non-empty caption
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text && request.generateCaption) {
      generatedCaption = textPart.text;
    }
  };

  // Run requests. Note: Parallel requests might hit rate limits, so we'll do batches of 3 max.
  const batchSize = 3;
  for (let i = 0; i < request.count; i += batchSize) {
    const promises = [];
    for (let j = 0; j < batchSize && i + j < request.count; j++) {
      promises.push(generateSingleImage());
    }
    await Promise.all(promises);
  }

  if (generatedImages.length === 0) {
    throw new Error("Failed to generate any images.");
  }

  return {
    images: generatedImages,
    caption: generatedCaption || undefined,
  };
};