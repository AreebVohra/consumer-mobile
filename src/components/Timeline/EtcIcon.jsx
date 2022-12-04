import * as React from 'react';
import Svg, {
  ClipPath, Defs, G, Path, Rect,
} from 'react-native-svg';

export default function EtcIcon(props) {
  return (
    <Svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_3872_6795)">
        <Rect x="0.941406" width="10" height="1" rx="0.5" fill="#C4C4C4" />
        <Rect x="2.94141" y="5" width="6" height="1" rx="0.5" fill="#C4C4C4" />
        <Rect x="1.94141" y="10" width="8" height="1" rx="0.5" fill="#C4C4C4" />
        <Rect x="0.941406" y="15" width="10" height="1" rx="0.5" fill="#C4C4C4" />
      </G>
      <Defs>
        <ClipPath id="clip0_3872_6795">
          <Rect width="10" height="16" fill="white" transform="translate(0.941406)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
