type ToolDeclaration = {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {type: string; description: string}>;
    required?: string[];
  };
};

export const functionDeclarations: ToolDeclaration[] = [
  {
    name: 'searchRoutes',
    description:
      'Search for transportation routes between origin and destination in Egypt. ' +
      'Returns route options with duration, cost, transfers, and step-by-step instructions. ' +
      'Supported modes: metro, bus, microbus, walking.',
    parameters: {
      type: 'object',
      properties: {
        origin: {
          type: 'string',
          description:
            'Origin location name in Egypt. Can be a district, landmark, or address (e.g., "المعادي", "مدينة نصر", "Ramses Station").'
        },
        destination: {
          type: 'string',
          description:
            'Destination location name in Egypt. Can be a district, landmark, or address (e.g., "التحرير", "القاهرة الجديدة", "Cairo Airport").'
        }
      },
      required: ['origin', 'destination']
    }
  },
  {
    name: 'searchForum',
    description:
      'Search community forum questions and answers for transportation information in Egypt. ' +
      'Returns relevant forum discussions including questions and replies from other users. ' +
      'Use this when the user asks a question that might have been answered by the community before.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Search query for finding relevant forum discussions — use the user\'s question as-is (e.g., "ازاي أوصل من الإسكندرية لبرج العرب", "cheapest route from Maadi to New Cairo").'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'searchPlaces',
    description:
      'Search for places, points of interest, or businesses in Egypt. ' +
      'Returns place name, rating, address, type, and approximate distance.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'What to search for — type of place, category, or specific name (e.g., "مطاعم", "كافيهات", "مستشفى", "صيدلية").'
        },
        location: {
          type: 'string',
          description:
            'Location to search near — district, landmark, or area in Egypt (e.g., "الزمالك", "وسط البلد", "مدينة نصر"). If omitted, search is general.'
        }
      },
      required: ['query']
    }
  }
];
