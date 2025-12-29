
import { GoogleGenAI, Type } from "@google/genai";
import { LiteracyScores } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getLiteracyInsight(scores: LiteracyScores, name: string) {
  if (!ai) {
    return "AI機能を使用するには、GEMINI_API_KEY環境変数を設定してください。";
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下のAIリテラシー・スコアを持つユーザー「${name}」に対して、強み、弱み、および具体的な学習アクションプランを300文字以内でアドバイスしてください。
      スコア (100点満点):
      - 基礎知識: ${scores.basics}
      - プロンプト工学: ${scores.prompting}
      - 倫理・リスク: ${scores.ethics}
      - ツール選定: ${scores.tools}
      - 自動化/活用: ${scores.automation}`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AIアドバイスの生成中にエラーが発生しました。";
  }
}
