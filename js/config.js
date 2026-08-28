/**
 * MagnetoClip - Client-Side Site Configuration
 * Contains only public-by-design values. All secrets (Paystack secret key,
 * EmailJS private key, Splitforms access key) live in Vercel env vars and are
 * used exclusively by the serverless functions under /api.
 */

const PAYSTACK_PUBLIC_KEY = 'pk_test_cb41932561435e820ba7979f380f46f6a9cdb2b7';

const SITE_BASE_URL = 'https://magnetoclip.vercel.app/';