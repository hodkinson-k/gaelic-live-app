// The backend address is read from the EXPO_PUBLIC_API_URL environment variable.
// Expo loads it from a `.env` file in this folder at `npx expo start` time and
// inlines the value into the JavaScript bundle. Copy `.env.example` to `.env`
// and set it to your machine's LAN IP so a phone on the same Wi-Fi can reach it.
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    'EXPO_PUBLIC_API_URL is not set. Copy mobile/.env.example to mobile/.env ' +
    'and restart `npx expo start`.'
  );
}
