import {GoogleGenerativeAI, type GenerativeModel} from '@google/generative-ai';

let model: GenerativeModel | null = null;

export function getModel(): GenerativeModel {
  if (!model) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GOOGLE_GENERATIVE_AI_API_KEY is not configured. ' +
          'Get a free key at https://aistudio.google.com/apikey'
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    });
  }
  return model;
}
