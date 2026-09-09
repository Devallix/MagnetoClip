/**
 * MagnetoClip - Client-Side Site Configuration
 * Contains only public-by-design values. All secrets (Paystack secret key,
 * EmailJS private key, Splitforms access key) live in Vercel env vars and are
 * used exclusively by the serverless functions under /api.
 */

const PAYSTACK_PUBLIC_KEY = 'pk_live_06e8819b675c475cda3c7ab8663dbfcebbbd6481';

const SITE_BASE_URL = 'https://magnetoclip.vercel.app/';