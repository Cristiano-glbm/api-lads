import Svg, { Path } from 'react-native-svg';

const STROKE_INACTIVE = '#949EAE';
const STROKE_PURPLE = '#4F39F6';
const STROKE_BLUE = '#2563EB';

export interface ForumProfisTabIcon20Props {
  active: boolean;
  accent?: 'purple' | 'blue';
}

/**
 * Ícone oficial da tab Profis. (asset `Icon.svg` — 20×20, 4 paths).
 */
export function ForumProfisTabIcon20({ active, accent = 'purple' }: ForumProfisTabIcon20Props) {
  const stroke = active ? (accent === 'blue' ? STROKE_BLUE : STROKE_PURPLE) : STROKE_INACTIVE;

  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11594 12.5 3.2681 12.8512 2.64298 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16666 3.99238 4.16666 5.83333C4.16666 7.67428 5.65905 9.16667 7.5 9.16667Z"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M18.3333 17.5001V15.8334C18.3328 15.0948 18.087 14.3774 17.6345 13.7937C17.182 13.2099 16.5484 12.793 15.8333 12.6084"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M13.3333 2.6084C14.0503 2.79198 14.6859 3.20898 15.1397 3.79366C15.5935 4.37833 15.8399 5.09742 15.8399 5.83757C15.8399 6.57771 15.5935 7.2968 15.1397 7.88147C14.6859 8.46615 14.0503 8.88315 13.3333 9.06673"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
