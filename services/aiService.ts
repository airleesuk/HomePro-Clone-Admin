
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product, PageBlock } from "../types";

export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async askExpert(query: string, availableProducts: Product[]): Promise<string> {
    const productContext = availableProducts.map(p => 
      `- ${p.name}: ฿${p.price.toLocaleString()} (หมวด ${p.category})`
    ).join('\n');

    const systemInstruction = `
      คุณคือผู้เชี่ยวชาญด้านการแต่งบ้านและเครื่องใช้ไฟฟ้าจาก HomePro 
      หน้าที่ของคุณคือตอบคำถามที่ซับซ้อนเกี่ยวกับการปรับปรุงบ้าน การเลือกซื้อเฟอร์นิเจอร์ หรือการเลือกเครื่องใช้ไฟฟ้าให้เหมาะสมกับความต้องการของลูกค้า
      
      ข้อมูลสินค้าที่มีในร้าน:
      ${productContext}

      คำแนะนำของคุณควรมีความเป็นมืออาชีพ มีเหตุผลรองรับ และถ้าเป็นไปได้ ให้แนะนำสินค้าที่มีอยู่ในรายการด้านบนที่เหมาะสมกับโจทย์ของลูกค้า
      ใช้ภาษาไทยที่เป็นกันเองแต่สุภาพ
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: query,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingBudget: 32768 }
        },
      });

      return response.text || "ขออภัยครับ ผมไม่สามารถประมวลผลคำตอบได้ในขณะนี้";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อกับผู้เชี่ยวชาญ AI";
    }
  }

  async generatePageLayout(prompt: string): Promise<PageBlock[]> {
    const systemInstruction = `
      You are an expert web designer and content strategist for 'Waree-TH', a HomePro-style e-commerce site selling water tanks, pumps, and home appliances.
      Your goal is to generate a JSON structure for a web page based on the user's description.

      Available Block Types & Schemas:
      1. hero: { title: string, subtitle: string, image: string (use a realistic unsplash source url with keywords relevant to the topic), buttonText: string }
      2. text: { content: string (Write professional, persuasive marketing copy in Thai HTML format using h2, h3, p, ul, li tags. Do not use markdown.) }
      3. product-row: { title: string, category: string (Choose best fit from: 'แทงค์น้ำ PE', 'เครื่องใช้ไฟฟ้า', 'ปั๊มน้ำ', 'ถังเก็บน้ำสแตนเลส', 'เครื่องกรองน้ำและอุปกรณ์', 'All'), count: number (default 4) }
      4. image: { url: string (use a realistic unsplash source url), alt: string, caption: string }
      5. spacer: { height: number (usually 30-50) }

      Rules:
      - The output must be a valid JSON array of objects.
      - Each object must have a "id" (generate a random string), "type" (one of the above), and "data" (matching the schema).
      - Do not wrap the JSON in markdown code blocks. Return ONLY the raw JSON string.
      - Generate realistic, high-quality Thai content for titles and text blocks.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-latest', // Flash is sufficient and faster for JSON structure generation
        contents: `Create a page layout for: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) return [];
      
      // Parse JSON
      const blocks = JSON.parse(text) as PageBlock[];
      
      // Ensure IDs are unique if AI mocked them poorly
      return blocks.map(b => ({
        ...b,
        id: `ai-block-${Math.random().toString(36).substr(2, 9)}`
      }));

    } catch (error) {
      console.error("AI Layout Gen Error:", error);
      return [];
    }
  }
}

export const aiService = new AiService();
