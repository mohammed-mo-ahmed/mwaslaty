const PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID;

let joseModule: typeof import('jose') | null = null;

async function getJose() {
  if (!joseModule) {
    joseModule = await import('jose');
  }
  return joseModule;
}

let cachedKeys: Record<string, string> | null = null;
let keysExpiry = 0;

async function getCertificates(): Promise<Record<string, string>> {
  if (cachedKeys && Date.now() < keysExpiry) return cachedKeys;

  const res = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  cachedKeys = (await res.json()) as Record<string, string>;
  keysExpiry = Date.now() + 3_600_000;

  return cachedKeys;
}

export type FirebaseTokenPayload = {
  uid: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

export async function verifyFirebaseToken(idToken: string): Promise<FirebaseTokenPayload> {
  if (!PROJECT_ID) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID env var.'
    );
  }

  const certs = await getCertificates();
  const jose = await getJose();

  for (const pem of Object.values(certs)) {
    try {
      const publicKey = await jose.importX509(pem, 'RS256');
      const { payload } = await jose.jwtVerify(idToken, publicKey, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
      });

      return {
        uid: payload.sub as string,
        email: payload.email as string | undefined,
        name: payload.name as string | undefined,
        ...payload,
      };
    } catch {
      continue;
    }
  }

  throw new Error('Failed to verify Firebase ID token');
}