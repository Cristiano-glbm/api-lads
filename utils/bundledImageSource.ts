import { Image, type ImageSourcePropType, Platform } from 'react-native';

type MetroAsset = number | string | { default?: string | number };

/**
 * Metro/Expo: `require('./x.png')` vira `number` no iOS/Android e muitas vezes
 * `string` (URL) ou `{ default: string }` no web. O `Image` do RN no web exige `{ uri }`.
 */
export function bundledImageSource(asset: MetroAsset): ImageSourcePropType {
  if (typeof asset === 'string') {
    return { uri: asset };
  }
  if (typeof asset === 'number') {
    if (Platform.OS === 'web') {
      const r = Image.resolveAssetSource(asset);
      if (r?.uri) return { uri: r.uri, width: r.width, height: r.height };
    }
    return asset;
  }
  if (asset && typeof asset === 'object' && 'default' in asset) {
    const d = asset.default;
    if (typeof d === 'string') return { uri: d };
    if (typeof d === 'number') return bundledImageSource(d);
  }
  return asset as ImageSourcePropType;
}
