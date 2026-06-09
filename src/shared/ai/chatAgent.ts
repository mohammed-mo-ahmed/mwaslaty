import {getModel} from './gemini';
import {functionDeclarations} from './definitions';
import {SYSTEM_PROMPT} from './systemPrompt';
import {searchRoutes} from './tools/routeSearch';
import {searchPlaces} from './tools/placeSearch';
import type {ChatHistoryItem, ChatResponse} from './types';

export async function processMessage(
  message: string,
  history: ChatHistoryItem[]
): Promise<ChatResponse> {
  const model = getModel();
  const chat = model.startChat({
    systemInstruction: SYSTEM_PROMPT,
    tools: [{functionDeclarations}],
    history: history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{text: h.text}]
    }))
  });

  let result = await chat.sendMessage(message);
  let responseText = "";
  let routes;
  let places;

  for (let round = 0; round < 3; round++) {
    const candidate = result.response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (!part) {
      responseText = result.response.text();
      break;
    }

    if (part.functionCall) {
      const fnCall = part.functionCall;
      const fnArgs = fnCall.args as Record<string, string | undefined>;

      if (fnCall.name === "searchRoutes") {
        const origin = fnArgs.origin ?? "";
        const destination = fnArgs.destination ?? "";
        const toolResult = await searchRoutes(origin, destination);
        routes = toolResult.routes;

        result = await chat.sendMessage([
          {
            functionResponse: {
              name: "searchRoutes",
              response: {
                text: toolResult.text,
                routes: toolResult.routes,
                duration: toolResult.routes[0]?.duration,
                cost: toolResult.routes[0]?.cost,
                transfers: toolResult.routes[0]?.transfers
              }
            }
          }
        ]);
      } else if (fnCall.name === "searchPlaces") {
        const query = fnArgs.query ?? "";
        const location = fnArgs.location;
        const toolResult = await searchPlaces(query, location);
        places = toolResult.places;

        result = await chat.sendMessage([
          {
            functionResponse: {
              name: "searchPlaces",
              response: {
                text: toolResult.text,
                places: toolResult.places
              }
            }
          }
        ]);
      } else {
        result = await chat.sendMessage([
          {
            functionResponse: {
              name: fnCall.name,
              response: {error: "Unknown function: " + fnCall.name}
            }
          }
        ]);
      }
    } else if (part.text) {
      responseText = part.text;
      break;
    } else {
      responseText = result.response.text();
      break;
    }
  }

  if (!responseText) {
    responseText = result.response.text();
  }

  return {text: responseText, routes, places};
}
