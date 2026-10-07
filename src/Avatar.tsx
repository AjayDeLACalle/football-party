import React from 'react';
import { Platform } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import type { AvatarConfig } from './profiles';
export const skinColors = ['#f8d7b5', '#e9ba8c', '#c89163', '#95623f', '#54382b'];
const heads = [
  'M44 53 Q43 31 80 31 Q117 31 116 53 L112 92 Q107 118 80 121 Q53 118 48 92Z',
  'M40 63 Q40 29 80 29 Q120 29 120 63 L117 94 Q110 118 80 121 Q50 118 43 94Z',
  'M45 37 L115 37 L118 90 L102 118 L58 118 L42 90Z',
  'M51 52 Q51 27 80 27 Q109 27 109 52 L107 95 Q98 126 80 126 Q62 126 53 95Z',
  'M44 36 Q80 24 116 36 L119 99 Q114 117 98 120 L62 120 Q46 117 41 99Z',
];
export function Avatar({ config, size = 64, label }: { config: AvatarConfig; size?: number; label?: string }) {
  const skin = skinColors[config.skin];
  const jersey = ['#24356b', '#f8dc35', '#f3f1e7', '#f3f1e7', '#213e8b'][config.jersey];
  return <Svg width={size} height={size * 1.12} viewBox="0 0 160 180" accessibilityLabel={label} aria-label={label} aria-hidden={label ? undefined : true} accessible={Platform.OS === 'web' ? undefined : !!label}>
    <Ellipse cx="80" cy="169" rx="68" ry="9" fill="#00000030" />
    <Path d="M20 171L26 143Q35 126 66 124L94 124Q125 126 134 143L140 171Z" fill={jersey} stroke="#14251d" strokeWidth="4" />
    {config.jersey === 0 && <G fill="#af264d"><Path d="M43 131L56 127V171H43Z" /><Rect x="73" y="128" width="14" height="43" /><Path d="M104 127L117 134V171H104Z" /></G>}
    {config.jersey === 1 && <G fill="#171f1a"><Rect x="53" y="130" width="8" height="41" /><Rect x="99" y="130" width="8" height="41" /><Path d="M28 142L38 134L45 148L33 154ZM122 134L133 142L127 154L115 148Z" /></G>}
    {config.jersey === 2 && <G stroke="#d9b96c" strokeWidth="3"><Line x1="38" y1="134" x2="46" y2="148" /><Line x1="122" y1="134" x2="114" y2="148" /><Line x1="49" y1="132" x2="54" y2="144" /><Line x1="111" y1="132" x2="106" y2="144" /></G>}
    {config.jersey === 3 && <G fill="#7dc6e4"><Path d="M40 136L54 129V171H40Z" /><Rect x="74" y="131" width="13" height="40" /><Path d="M107 129L121 137V171H107Z" /></G>}
    {config.jersey === 4 && <G><Path d="M26 145L38 134L45 149L32 155Z" fill="#d4494e" /><Path d="M122 134L134 145L128 155L115 149Z" fill="#f5f1e6" /></G>}
    <Path d="M65 107V130Q80 145 95 130V107Z" fill={skin} stroke="#3a2a25" strokeWidth="3" />
    <Circle cx="45" cy="76" r="9" fill={skin} /><Circle cx="115" cy="76" r="9" fill={skin} />
    <Path d={heads[config.head]} fill={skin} stroke="#3a2a25" strokeWidth="3" />
    {config.hair === 0 && <Path d="M43 58L40 41L49 32L50 24L63 26L69 17L79 23L91 16L99 25L114 27L120 46L116 61L105 44L86 48L66 43L51 49Z" fill="#302720" />}
    {config.hair === 1 && <Path d="M43 61Q35 24 70 23Q102 14 116 36L119 61L106 47L78 41L57 52Z" fill="#493220" />}
    {config.hair === 2 && <G fill="#28241f"><Path d="M44 44Q48 21 80 22Q113 21 117 44L123 111L109 115L108 56L83 43L53 60L51 113L38 110Z" /><Path d="M113 55L122 55L134 120L112 115Z" /></G>}
    {config.hair === 3 && <G><Path d="M45 53Q46 28 79 29Q115 27 116 53L106 48Q79 37 54 49Z" fill="#564633" /><Path d="M69 45L65 25L71 17L81 10L91 19L95 44Z" fill="#e3c76e" /></G>}
    {config.hair === 4 && <Path d="M45 49Q43 25 80 26Q117 25 115 49L105 43Q80 34 54 43Z" fill="#47372b" opacity="0.65" />}
    <G stroke="#332921" strokeWidth="3" strokeLinecap="round"><Line x1="56" y1="63" x2="70" y2="61" /><Line x1="90" y1="61" x2="104" y2="63" /></G>
    <Ellipse cx="63" cy="73" rx="4" ry="5" fill="#282820" /><Ellipse cx="97" cy="73" rx="4" ry="5" fill="#282820" />
    <Path d="M80 76L76 90L84 90M68 101Q80 110 92 101" stroke="#583c2b" strokeWidth="3" fill="none" strokeLinecap="round" />
    {config.accessory === 1 && <G><Path d="M41 47Q40 13 78 13Q115 13 117 47Z" fill="#c4fa61" stroke="#23432c" strokeWidth="3" /><Path d="M76 42Q123 37 138 49Q125 62 84 52Z" fill="#8cbf41" stroke="#23432c" strokeWidth="3" /></G>}
    {config.accessory === 2 && <G fill="#1a283a" stroke="#111d22" strokeWidth="3"><Rect x="49" y="65" width="27" height="20" rx="6" /><Rect x="85" y="65" width="27" height="20" rx="6" /><Line x1="76" y1="71" x2="85" y2="71" /><Line x1="40" y1="69" x2="49" y2="71" /><Line x1="112" y1="71" x2="120" y2="69" /></G>}
    {config.accessory === 3 && <G><Path d="M57 120Q80 137 103 120L111 133Q80 155 49 133Z" fill="#ff9b61" stroke="#814c31" strokeWidth="3" /><Path d="M94 133L113 140L108 178L91 173Z" fill="#ff9b61" /><Line x1="94" y1="159" x2="111" y2="164" stroke="#f6e5b8" strokeWidth="5" /></G>}
    {config.accessory === 4 && <Path d="M44 51Q80 41 116 51L116 61Q80 51 44 61Z" fill="#f2f4e5" stroke="#c4fa61" strokeWidth="3" />}
    {config.accessory === 5 && <Circle cx="115" cy="87" r="5" stroke="#f8d759" strokeWidth="3" fill="none" />}
  </Svg>;
}
