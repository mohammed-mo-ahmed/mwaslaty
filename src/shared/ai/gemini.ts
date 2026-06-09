const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.0-flash';

export type GeminiPart =
  | {text: string}
  | {functionCall: {name: string; args: Record<string, unknown>}}
  | {functionResponse: {name: string; response: unknown}};

export type GeminiContent = {
  role: 'user' | 'model' | 'function';
  parts: GeminiPart[];
};

type GeminiCandidate = {
  content: {parts: GeminiPart[]};
  finishReason?: string;
};

export type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

type GeminiRequest = {
  system_instruction?: {parts: [{text: string}]};
  contents: GeminiContent[];
  tools?: Array<{
    function_declarations: Array<{
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, {type: string; description: string}>;
        required?: string[];
      };
    }>;
  }>;
};

export async function generateContent(params: {
  systemInstruction?: string;
  contents: GeminiContent[];
  tools?: GeminiRequest['tools'];
}): Promise<GeminiResponse> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GOOGLE_GENERATIVE_AI_API_KEY is not configured. ' +
        'Get a free key at https://aistudio.google.com/apikey'
    );
  }

  const url = `${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`;

  const body: GeminiRequest = {contents: params.contents};

  if (params.systemInstruction) {
    body.system_instruction = {parts: [{text: params.systemInstruction}]};
  }

  if (params.tools) {
    body.tools = params.tools;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${text}`);
  }

  return res.json() as Promise<GeminiResponse>;
}
