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
//     ['encrypt', 'decrypt'],
//   );
// }

// async function encryptData(plainText: string, pin: string) {
//   const salt = crypto.getRandomValues(new Uint8Array(16));
//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const key = await deriveKey(pin, salt);
//   const ciphertext = await crypto.subtle.encrypt(
//     { name: 'AES-GCM', iv },
//     key,
//     encoder.encode(plainText),
//   );

//   return {
//     ciphertext: toBase64(ciphertext),
//     iv: toBase64(iv),
//     salt: toBase64(salt),
//   };
// }

// function jsonResponse(body: unknown, status = 200) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// serve(async (req) => {
//   try {
//     const { data, pin } = await req.json();

//     if (!data || typeof data !== 'string' || !pin || typeof pin !== 'string' || pin.length < 4) {
//       return jsonResponse({ error: 'Please provide a secure payload and a 4-digit PIN.' }, 400);
//     }

//     const encrypted = await encryptData(data, pin);
//     const { data: insertedRow, error } = await supabase
//       .from('secure_qr_records')
//       .insert({
//         payload: JSON.stringify(encrypted),
//         iv: encrypted.iv,
//         salt: encrypted.salt,
//       })
//       .select('id')
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return jsonResponse({ uuid: insertedRow.id });
//   } catch (error) {
//     return jsonResponse({ error: error instanceof Error ? error.message : 'Failed to create secure QR.' }, 500);
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

function toBase64(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
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
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptData(plainText: string, pin: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plainText),
  );

  return {
    ciphertext: toBase64(ciphertext),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
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
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    const { data, pin } = await req.json();

    if (
      !data ||
      typeof data !== 'string' ||
      !pin ||
      typeof pin !== 'string' ||
      pin.length < 4
    ) {
      return jsonResponse(
        { error: 'Please provide a secure payload and a 4-digit PIN.' },
        400,
      );
    }

    const encrypted = await encryptData(data, pin);

    const { data: insertedRow, error } = await supabase
      .from('secure_qr_records')
      .insert({
        payload: JSON.stringify(encrypted),
        iv: encrypted.iv,
        salt: encrypted.salt,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return jsonResponse({ uuid: insertedRow.id });
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create secure QR.',
      },
      500,
    );
  }
});