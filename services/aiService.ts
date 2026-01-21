
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product, PageBlock, BlockType } from "../types";

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
      3. product-row: { title: string, category: string (Choose best fit from: 'แทงค์น้ำ PE', 'เครื่องใช้ไฟฟ้า', 'ปั๊มน้ำ', 'ถังเก็บน้ำสแตนเลส', 'เครื่องกรองน้ำและอุปกรณ์..', 'All'), count: number (default 4) }
      4. image: { url: string (use a realistic unsplash source url), alt: string, caption: string }
      5. spacer: { height: number (usually 30-50) }
      6. grid: { columns: number (2, 3, or 4), items: Array<{ title: string, description: string, image: string }> }
      7. testimonial: { title: string, items: Array<{ name: string, role: string, quote: string, avatar: string (optional unsplash url or empty) }> }

      Rules:
      - The output must be a valid JSON array of objects.
      - Each object must have a "id" (generate a random string), "type" (one of the above), and "data" (matching the schema).
      - Do not wrap the JSON in markdown code blocks. Return ONLY the raw JSON string.
      - Generate realistic, high-quality Thai content for titles and text blocks.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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

  async generateBlock(type: BlockType, prompt: string): Promise<PageBlock | null> {
    const systemInstruction = `
      You are an expert UI/UX designer. Generate a single JSON object for a web component (Block) of type '${type}'.
      Context: ${prompt}
      
      Schemas:
      - hero: { title, subtitle, image (realistic unsplash url), buttonText }
      - text: { content (Write rich Thai HTML marketing copy using h2, h3, p, ul, strong. No markdown.) }
      - product-row: { title, category (choose from: 'แทงค์น้ำ PE', 'เครื่องใช้ไฟฟ้า', 'ปั๊มน้ำ', 'All'), count }
      - image: { url (realistic unsplash url), alt, caption }
      - grid: { columns (2-4), items: [{title, description, image (realistic unsplash url)}] }
      - spacer: { height }
      - testimonial: { title, items: [{name, role, quote, avatar (unsplash url)}] }

      Return ONLY the JSON object representing the Block Data. Do not wrap in array. Do not wrap in markdown.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a '${type}' block. Details: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) return null;
      
      const blockData = JSON.parse(text);
      
      return {
        id: `ai-single-block-${Date.now()}`,
        type,
        data: blockData
      };

    } catch (error) {
      console.error("AI Single Block Gen Error:", error);
      return null;
    }
  }

  async generateSql(prompt: string): Promise<string> {
    const systemInstruction = `
      You are a SQL expert for a local AlaSQL (SQLite-compatible) database.
      Your task is to convert natural language queries into valid, executable SQL queries.
      
      IMPORTANT: The user may ask questions in THAI. You must interpret the Thai intent and generate the corresponding SQL.

      Database Schema:
      1. products (id, name, price, originalPrice, category, stock, sold, discount, isFlashSale, isFeatured, brandId)
      2. categories (id, name, icon, iconKey)
      3. brands (id, name, logo)
      4. users (id, name, email, role, createdAt)
      5. orders (id, userId, userName, totalAmount, status, createdAt)
      6. product_variants (id, productId, productName, name, price, stock)

      Rules:
      - Return ONLY the raw SQL string. Do not include markdown formatting (like \`\`\`sql) or explanations.
      - If the user asks for "all products", use SELECT * FROM products.
      - Supports JOINs, WHERE, ORDER BY, GROUP BY.
      - For "low stock", assume stock < 5.
      - For "best selling", order by sold DESC.
      - Always use single quotes for strings.
      - Example Thai: "หาสินค้าที่ราคามากกว่า 5000" -> SELECT * FROM products WHERE price > 5000
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate SQL for: ${prompt}`,
        config: {
          systemInstruction,
        },
      });

      return response.text?.replace(/```sql|```/g, '').trim() || "";
    } catch (error) {
      console.error("AI SQL Gen Error:", error);
      return "";
    }
  }

  async generateKeywordUrl(prompt: string): Promise<string> {
    const systemInstruction = `
      You are an SEO expert specializing in e-commerce. Your task is to generate a short, keyword-rich, and URL-friendly slug from a given topic or product description.
      The output should only contain lowercase letters, numbers, and hyphens, separating words with single hyphens.
      Do not include any special characters, spaces, or file extensions (e.g., .html, .php).
      Keep it concise and relevant to the keywords.
      Return ONLY the slug, without any explanations, conversational text, or markdown formatting.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      // Clean up any stray markdown or conversational text just in case
      return response.text?.replace(/```|`|\s/g, '').replace(/[^a-z0-9-]/g, '').toLowerCase().trim() || "";
    } catch (error) {
      console.error("AI Keyword URL Gen Error:", error);
      return "";
    }
  }

  async generateSeoKeywords(prompt: string): Promise<string> {
    const systemInstruction = `
      You are an expert SEO specialist for Thailand e-commerce market (Waree-TH). 
      Your task is to generate a set of highly relevant SEO keywords and hashtags based on the product name or description provided.
      
      Requirements:
      1. Generate 8-12 comma-separated keywords (mix of Thai and English).
      2. Include 3-5 relevant hashtags at the end.
      3. Focus on search intent for water pumps, water tanks, home improvement, and appliances.
      4. Output format: "keyword1, keyword2, keyword3 ... #hashtag1 #hashtag2"
      5. Return ONLY the text string, no explanations.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      return response.text?.trim() || "";
    } catch (error) {
      console.error("AI SEO Keywords Gen Error:", error);
      return "";
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
         const parts = candidates[0].content?.parts;
         if (parts) {
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
         }
      }
      return null;
    } catch (error) {
      console.error("AI Image Gen Error:", error);
      return null;
    }
  }
}

export const aiService = new AiService();
