
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";

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
}

export const aiService = new AiService();
