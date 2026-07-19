import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

export function InstagramLogo({ size = 27 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <RadialGradient id="igfill" cx="0.32" cy="1.05" r="1.15">
          <Stop offset="0" stopColor="#FED576" />
          <Stop offset="0.13" stopColor="#FADA5E" />
          <Stop offset="0.29" stopColor="#F98C42" />
          <Stop offset="0.44" stopColor="#F45D5D" />
          <Stop offset="0.58" stopColor="#D62E85" />
          <Stop offset="0.74" stopColor="#962FBF" />
          <Stop offset="1" stopColor="#4E60D3" />
        </RadialGradient>
      </Defs>
      <Rect x="2" y="2" width="44" height="44" rx="13" fill="url(#igfill)" />
      <Rect x="13.5" y="13.5" width="21" height="21" rx="6.5" fill="none" stroke="#fff" strokeWidth="3" />
      <Circle cx="24" cy="24" r="6.2" fill="none" stroke="#fff" strokeWidth="3" />
      <Circle cx="33.4" cy="14.6" r="1.9" fill="#fff" />
    </Svg>
  );
}

const TIKTOK_NOTE =
  'M30.4 11.5c.55 3.28 2.42 5.25 5.6 5.46v3.9c-1.84.18-3.45-.42-5.33-1.56v6.98c0 8.87-9.67 11.64-13.56 5.28-2.5-4.1-.96-11.28 7.08-11.57v4.11c-.61.1-1.27.26-1.87.47-1.8.61-2.82 1.75-2.54 3.76.54 3.85 7.6 4.99 7.01-2.54V11.5h3.6z';

export function TikTokLogo({ size = 27 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect width="48" height="48" rx="12" fill="#010101" />
      <G transform="translate(-1.35 -1.05)">
        <Path d={TIKTOK_NOTE} fill="#25F4EE" />
      </G>
      <G transform="translate(1.35 1.05)">
        <Path d={TIKTOK_NOTE} fill="#FE2C55" />
      </G>
      <Path d={TIKTOK_NOTE} fill="#fff" />
    </Svg>
  );
}

export function FacebookLogo({ size = 27 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect width="48" height="48" rx="12" fill="#1877F2" />
      <Path
        d="M30.2 25.3l.9-5.75h-5.52v-3.73c0-1.57.77-3.11 3.25-3.11h2.51V7.8s-2.28-.39-4.46-.39c-4.55 0-7.53 2.76-7.53 7.75v4.39h-5.05v5.75h5.05V39.2h6.22V25.3h4.63z"
        fill="#fff"
      />
    </Svg>
  );
}

export function YouTubeLogo({ size = 27 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect x="3" y="13" width="42" height="22" rx="7" fill="#FF0000" />
      <Path d="M20.5 18.7l9.2 5.3-9.2 5.3z" fill="#fff" />
    </Svg>
  );
}

export function GoogleLogo({ size = 23 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}
