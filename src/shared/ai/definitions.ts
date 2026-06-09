import type {FunctionDeclaration} from "@google/generative-ai";

export const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "searchRoutes",
    description:
      "Search for transportation routes between origin and destination in Egypt. " +
      "Returns route options with duration, cost, transfers, and step-by-step instructions. " +
      "Supported modes: metro, bus, microbus, walking.",
    parameters: {
      type: "object" as any,
      properties: {
        origin: {
          type: "string" as any,
          description:
            'Origin location name in Egypt. Can be a district, landmark, or address (e.g., "المعادي", "مدينة نصر", "Ramses Station").'
        },
        destination: {
          type: "string" as any,
          description:
            'Destination location name in Egypt. Can be a district, landmark, or address (e.g., "التحرير", "القاهرة الجديدة", "Cairo Airport").'
        }
      },
      required: ["origin", "destination"]
    }
  },
  {
    name: "searchPlaces",
    description:
      "Search for places, points of interest, or businesses in Egypt. " +
      "Returns place name, rating, address, type, and approximate distance.",
    parameters: {
      type: "object" as any,
      properties: {
        query: {
          type: "string" as any,
          description:
            'What to search for — type of place, category, or specific name (e.g., "مطاعم", "كافيهات", "مستشفى", "صيدلية").'
        },
        location: {
          type: "string" as any,
          description:
            'Location to search near — district, landmark, or area in Egypt (e.g., "الزمالك", "وسط البلد", "مدينة نصر"). If omitted, search is general.'
        }
      },
      required: ["query"]
    }
  }
];
