import React from 'react';
import { Image, Platform, View } from 'react-native';
import type { AvatarConfig } from './profiles';
const sheet = require('../assets/chibi/players.png');
const COLUMNS = 4;
const ROWS = 3;
// Display the generated sprite atlas without modifying the source artwork.
// 1448 × 1086: twelve square cells, with no inter-cell gutters.
export function Avatar({ config, size = 64, label }: { config: AvatarConfig; size?: number; label?: string }) {
  const height = size;
  const column = config.character % COLUMNS;
  const row = Math.floor(config.character / COLUMNS);
  return <View accessible={Platform.OS === 'web' ? undefined : !!label} accessibilityLabel={label} aria-label={label} aria-hidden={label ? undefined : true} style={{ width: size, height, overflow: 'hidden' }}>
    <Image source={sheet} resizeMode="stretch" style={{ position: 'absolute', width: size * COLUMNS, height: height * ROWS, left: -column * size, top: -row * height }} />
  </View>;
}
