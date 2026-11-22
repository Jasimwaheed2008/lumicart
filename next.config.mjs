/** @type {import('next').NextConfig} */
// Admins can paste any https image URL, so all https hosts are allowed. Restrict this list for stricter production setups.
export default { images: { remotePatterns: [{ protocol: "https", hostname: "**" }] } };
