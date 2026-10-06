import React from 'react';
import Svg, {Line, Path, Rect} from 'react-native-svg';
import {Colors} from '../constants/theme';

type PaisaMarkProps = {
  colors: Colors;
  size?: number;
};

export default function PaisaMark({colors, size = 52}: PaisaMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Paisa logo">
      <Rect x="2" y="2" width="60" height="60" rx="17" fill={colors.primary} />
      <Path d="M23 49V15H35C44 15 49 20 49 28C49 36 44 41 35 41H23" fill="none" stroke={colors.white} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="23" y1="28" x2="35" y2="28" stroke={colors.white} strokeWidth="5.5" strokeLinecap="round" />
      <Line x1="21" y1="52" x2="43" y2="52" stroke={colors.warning} strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
