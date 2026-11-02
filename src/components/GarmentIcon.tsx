import React from 'react';
import { Image, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { Garment, Kind } from '../data/types';
import { C, isDark } from '../theme';

export type IconKind = Kind | 'watch' | 'bag' | 'scarf' | 'hat';

/** Accessories share one kind; pick a more specific silhouette from the name. */
export function iconFor(item: Pick<Garment, 'kind' | 'name'>): IconKind {
  if (item.kind !== 'acc') return item.kind;
  const n = item.name.toLowerCase();
  if (n.includes('час')) return 'watch';
  if (n.includes('сумк')) return 'bag';
  if (n.includes('шарф')) return 'scarf';
  if (n.includes('шляп') || n.includes('кепк')) return 'hat';
  return 'acc';
}

export function GarmentIcon({ kind, size, color }: { kind: IconKind; size: number | `${number}%`; color: string }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {kind === 'top' && <Path {...common} d="M17 8L10 12L5 20L11 24L14 21V40H34V21L37 24L43 20L38 12L31 8C30 11 27.5 13 24 13C20.5 13 18 11 17 8Z" />}
      {kind === 'outer' && (
        <>
          <Path {...common} d="M17 6L9 10L6 40H13L14 22V43H34V22L35 40H42L39 10L31 6L24 14Z" />
          <Path {...common} d="M24 14V43" />
        </>
      )}
      {kind === 'bottom' && <Path {...common} d="M15 6H33L36 42H27L24 18L21 42H12Z" />}
      {kind === 'dress' && <Path {...common} d="M19 5H29L28 14L37 43H11L20 14Z" />}
      {kind === 'shoes' && (
        <>
          <Path {...common} d="M5 31C5 25 8 21 12 19L18 23C22 25 26 25 30 26L40 28C43 29 44 31 44 34V37H5Z" />
          <Path {...common} d="M5 33H44" />
        </>
      )}
      {kind === 'acc' && (
        <>
          <Circle {...common} cx={14} cy={26} r={7} />
          <Circle {...common} cx={34} cy={26} r={7} />
          <Path {...common} d="M21 26H27M7 24L4 19M41 24L44 19" />
        </>
      )}
      {kind === 'watch' && (
        <>
          <Circle {...common} cx={24} cy={24} r={10} />
          <Path {...common} d="M24 19V24L27 26M19 15L20 5H28L29 15M19 33L20 43H28L29 33" />
        </>
      )}
      {kind === 'bag' && (
        <>
          <Path {...common} d="M8 18H40L37 42H11Z" />
          <Path {...common} d="M17 18C17 10 20 6 24 6C28 6 31 10 31 18" />
        </>
      )}
      {kind === 'scarf' && (
        <>
          <Path {...common} d="M12 10C18 14 30 14 36 10L34 18C28 21 20 21 14 18Z" />
          <Path {...common} d="M28 19L32 42H24L22 20" />
        </>
      )}
      {kind === 'hat' && (
        <>
          <Path {...common} d="M4 32C10 36 38 36 44 32C40 29 36 28 34 28" />
          <Path {...common} d="M14 28C14 18 18 13 24 13C30 13 34 18 34 28C30 30 18 30 14 28Z" />
        </>
      )}
    </Svg>
  );
}

/** Square tile showing a garment (photo if there is one, otherwise a coloured silhouette). */
export function GarmentTile({
  item, size, radius = 16, ring, style,
}: { item: Garment & { photoUri?: string }; size?: number; radius?: number; ring?: boolean; style?: ViewStyle }) {
  const box: ViewStyle = size ? { width: size, height: size } : { width: '100%', aspectRatio: 1 };
  const ink = isDark(item.color) ? '#FFFFFF' : C.ink;
  const light = item.color.toUpperCase() === '#FFFFFF' || item.color.toUpperCase() === '#F5F5F3';
  return (
    <View
      style={[box, {
        borderRadius: radius, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        borderWidth: ring ? 2 : light ? 1 : 0, borderColor: ring ? C.accent : C.line,
      }, style]}
    >
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ width: '58%', aspectRatio: 1 }}>
          <GarmentIcon kind={iconFor(item)} size="100%" color={ink} />
        </View>
      )}
    </View>
  );
}
