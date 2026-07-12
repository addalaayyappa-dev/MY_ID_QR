// import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
// const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: false,
//     autoRefreshToken: false,
//   },
// });

// const encoder = new TextEncoder();
// const decoder = new TextDecoder();

// function toBase64(buffer: ArrayBuffer | Uint8Array) {
//   const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
//   let binary = '';
//   bytes.forEach((byte) => {
//     binary += String.fromCharCode(byte);
//   });
//   return btoa(binary);
// }

// function fromBase64(value: string) {
//   const binary = atob(value);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i += 1) {
//     bytes[i] = binary.charCodeAt(i);
//   }
//   return bytes;
// }

// async function deriveKey(pin: string, salt: Uint8Array) {
//   const keyMaterial = await crypto.subtle.importKey(
//     'raw',
//     encoder.encode(pin),
//     { name: 'PBKDF2' },
//     false,
//     ['deriveKey'],
//   );

//   return crypto.subtle.deriveKey(
//     {
//       name: 'PBKDF2',
//       salt,
//       iterations: 100_000,
//       hash: 'SHA-256',
//     },
//     keyMaterial,
//     { name: 'AES-GCM', length: 256 },
//     false,
//     ['decrypt'],
//   );
// }

// async function decryptData(payload: { ciphertext: string; iv: string; salt: string }, pin: string) {
//   const key = await deriveKey(pin, fromBase64(payload.salt));

//   try {
//     const decrypted = await crypto.subtle.decrypt(
//       { name: 'AES-GCM', iv: fromBase64(payload.iv) },
//       key,
//       fromBase64(payload.ciphertext),
//     );

//     return decoder.decode(decrypted);
//   } catch (_error) {
//     throw new Error('Incorrect PIN or corrupted record.');
//   }
// }

// function jsonResponse(body: unknown, status = 200) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// serve(async (req) => {
//   try {
//     const { uuid, pin } = await req.json();

//     if (!uuid || typeof uuid !== 'string' || !pin || typeof pin !== 'string' || pin.length < 4) {
//       return jsonResponse({ error: 'Please provide a valid QR ID and 4-digit PIN.' }, 400);
//     }

//     const { data, error } = await supabase
//       .from('secure_qr_records')
//       .select('payload')
//       .eq('id', uuid)
//       .maybeSingle();

//     if (error) {
//       throw new Error(error.message);
//     }

//     if (!data?.payload) {
//       return jsonResponse({ error: 'QR record not found.' }, 404);
//     }

//     const payload = JSON.parse(data.payload as string);
//     const decrypted = await decryptData(payload, pin);

//     return jsonResponse({ data: decrypted });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : 'Failed to view secure QR.';
//     const status = message === 'Incorrect PIN or corrupted record.' ? 401 : 500;
//     return jsonResponse({ error: message }, status);
//   }
// });










import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function deriveKey(pin: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
}

async function decryptData(
  payload: {
    ciphertext: string;
    iv: string;
    salt: string;
  },
  pin: string,
) {
  const key = await deriveKey(pin, fromBase64(payload.salt));

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: fromBase64(payload.iv),
    },
    key,
    fromBase64(payload.ciphertext),
  );

  return decoder.decode(decrypted);
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    const { uuid, pin } = await req.json();

    if (
      !uuid ||
      typeof uuid !== 'string' ||
      !pin ||
      typeof pin !== 'string' ||
      pin.length < 4
    ) {
      return jsonResponse(
        {
          error: 'Please provide a valid QR ID and 4-digit PIN.',
        },
        400,
      );
    }

    const { data, error } = await supabase
      .from('secure_qr_records')
      .select('payload')
      .eq('id', uuid)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.payload) {
      return jsonResponse(
        {
          error: 'QR record not found.',
        },
        404,
      );
    }

    const payload = JSON.parse(data.payload as string);

    // Wrong PIN handling
    try {
      const decrypted = await decryptData(payload, pin);

      return jsonResponse({
        data: decrypted,
      });
    } catch {
      return jsonResponse(
        {
          error: 'Incorrect PIN.',
        },
        401,
      );
    }
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to view secure QR.',
      },
      500,
    );
  }
});