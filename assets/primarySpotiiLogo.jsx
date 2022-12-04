import * as React from 'react';
import Svg, {
  Path, G, Defs, Rect, ClipPath,
} from 'react-native-svg';

export default function PrimarySpotiiLogo(props) {
  return (
    <Svg width="132" height="44" viewBox="0 0 132 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M26.2424 12.5354L32.5504 6.22721C25.5727 -0.743885 14.265 -0.738901 7.29362 6.23896C6.23454 7.29893 5.31295 8.48835 4.55078 9.77855C11.5639 5.64354 20.4865 6.77741 26.2424 12.5354Z" fill="#AA8FFF" />
      <Path d="M26.2424 12.5354L32.5504 6.22721C25.5727 -0.743885 14.265 -0.738901 7.29362 6.23896C6.23454 7.29893 5.31295 8.48835 4.55078 9.77855C11.5639 5.64354 20.4865 6.77741 26.2424 12.5354" stroke="white" />
      <Path d="M7.30529 31.473L1 37.7781C7.98246 44.7491 19.2937 44.7393 26.2645 37.7568C27.3202 36.6993 28.2391 35.5134 28.9998 34.227C21.9858 38.3613 13.0637 37.2285 7.30529 31.473Z" fill="white" stroke="white" />
      <Path d="M26.2428 12.5342L7.30518 31.4718C13.0636 37.2272 21.9856 38.36 28.9997 34.2257C33.1347 27.2125 32.0008 18.29 26.2428 12.5342Z" fill="#AA8FFF" stroke="white" />
      <Path d="M7.30544 31.4755L26.2431 12.5379C20.4872 6.77994 11.5646 5.64608 4.55148 9.78109C0.417159 16.7949 1.54984 25.7171 7.30544 31.4755Z" fill="white" stroke="white" />
      <Path d="M65.4639 17.7794C65.5408 20.2135 67.3438 22.16 69.5618 22.16C71.8312 22.16 73.6707 20.128 73.6707 17.6211C73.6707 15.1145 71.8312 13.0803 69.5618 13.0803C67.3438 13.0803 65.5408 15.0288 65.4639 17.4607V17.7794ZM65.4639 25.7961V34.2427L59.8877 31.1798V7.94698H65.4639V9.44408C66.8734 8.47011 68.5458 7.94787 70.2591 7.94698C75.2173 7.94698 79.2426 12.2782 79.2426 17.6211C79.2426 22.9643 75.2235 27.2955 70.2591 27.2955C68.5457 27.2926 66.8735 26.7699 65.4639 25.7961ZM104.36 7.94698H101.004V13.5422H104.36V21.1504C104.36 24.5442 107.111 27.2955 110.505 27.2955C110.505 27.2955 110.506 27.2955 110.507 27.2955H113.288V21.7214H112.541C111.099 21.7214 109.932 20.4382 109.932 18.8383V13.5422H113.288V7.94698H109.934V4.10754L104.343 0.999741L104.36 7.94698ZM126.125 13.0054V27.2955H131.699V16.0683L126.125 13.0054ZM128.906 11.6301C130.442 11.6301 131.687 10.3851 131.687 8.84954C131.687 7.31399 130.442 6.06901 128.906 6.06901C127.37 6.06901 126.125 7.31399 126.125 8.84954C126.125 10.3851 127.37 11.6301 128.906 11.6301ZM116.924 27.2955H122.502V11.0099L116.917 7.94698L116.924 27.2955ZM119.704 0.999741C118.169 0.999741 116.924 2.24471 116.924 3.78027C116.924 5.31601 118.169 6.56081 119.704 6.56081C121.24 6.56081 122.485 5.31601 122.485 3.78027C122.485 2.24471 121.24 0.999741 119.704 0.999741ZM94.2342 17.6233C94.2342 15.1145 92.3947 13.0825 90.1274 13.0825C87.8604 13.0825 86.0123 15.1166 86.0123 17.6233C86.0123 20.1301 87.8516 22.1621 90.1211 22.1621C92.3905 22.1621 94.2278 20.1301 94.2278 17.6233H94.2342ZM99.7953 17.6233C99.7953 22.9664 95.4641 27.2976 90.1211 27.2976C84.778 27.2976 80.4468 22.9664 80.4468 17.6233C80.4468 12.2803 84.778 7.94911 90.1211 7.94911C95.4628 7.94787 99.7941 12.2773 99.7953 17.619C99.7953 17.6204 99.7953 17.6219 99.7953 17.6233ZM57.4793 21.1355C57.4793 24.2518 55.0944 27.2955 50.2069 27.2955C44.4854 27.2955 42.6523 23.593 42.5068 21.5761L47.2382 20.7204C47.3129 21.9675 48.1922 23.1781 50.0979 23.1781C51.5288 23.1781 52.2261 22.408 52.2261 21.6018C52.2261 20.9408 51.7854 20.391 50.4293 20.1045L48.3396 19.6275C44.451 18.7848 42.911 16.5838 42.911 14.0171C42.911 10.6805 45.8458 7.96621 49.916 7.96621C55.1969 7.97048 57.03 11.2665 57.214 13.4053L52.5918 14.2502C52.4463 13.0398 51.6764 12.0131 49.9888 12.0131C48.9194 12.0131 48.0081 12.6354 48.0081 13.5892C48.0081 14.3593 48.6327 14.8 49.4389 14.9455L51.8582 15.4225C55.6376 16.186 57.4793 18.4575 57.4793 21.1355Z" fill="white" />
      <Path d="M50.7675 41.4379L50.9418 42.8542H57.0109L56.8116 41.2356H53.9795L53.957 41.0336L56.5627 39.2127L56.3889 37.8002L50.3081 37.7966L50.518 39.415H53.3507L53.3758 39.6174L50.7675 41.4379Z" fill="white" />
      <Path d="M57.0938 37.7966L57.7137 42.8542H63.7935L63.1714 37.7966H57.0938Z" fill="white" />
      <Path d="M67.9196 40.4248L66.0172 40.4265L65.8701 39.2129L67.7801 39.2145C68.2299 39.2198 68.46 39.4731 68.497 39.8195C68.521 40.0426 68.4187 40.4248 67.9196 40.4248ZM70.1657 39.6174C70.0256 38.4807 69.1325 37.7917 67.9188 37.7966L63.873 37.7968L64.5089 42.8542H66.3158L66.1915 41.8426H68.116C69.6307 41.8426 70.3239 40.8988 70.1657 39.6174Z" fill="white" />
      <Path d="M57.6936 37.12C58.0912 37.4739 58.6651 37.4739 58.9749 37.12C59.2849 36.7661 59.2138 36.1925 58.8162 35.8387C58.4185 35.4849 57.8448 35.4849 57.5348 35.8387C57.2248 36.1925 57.2958 36.7661 57.6936 37.12Z" fill="white" />
      <Path d="M74.6743 40.4248L72.7721 40.4265L72.625 39.2129L74.535 39.2145C74.9846 39.2198 75.2147 39.4731 75.2519 39.8195C75.2757 40.0426 75.1735 40.4248 74.6743 40.4248ZM76.9204 39.6174C76.7803 38.4807 75.8874 37.7917 74.6736 37.7966L70.6279 37.7968L71.2636 42.8542H73.0707L72.9462 41.8426H74.8708C76.3854 41.8426 77.0786 40.8988 76.9204 39.6174Z" fill="white" />
      <Path d="M79.4749 39.4129L79.1227 40.8293H80.4332L79.663 39.4129H79.4749ZM81.0069 41.8376H78.8375L78.5611 42.8469L76.7183 42.843L78.3218 37.791H80.3449L83.3938 42.8469L81.5776 42.8415L81.0069 41.8376Z" fill="white" />
      <Path d="M84.2047 42.8503L83.9554 40.8353L81.2559 37.7944H83.2115L84.6521 39.4204H84.8357L85.9774 37.8038L87.933 37.8036L85.7805 40.8353L86.0321 42.8542L84.2047 42.8503Z" fill="white" />
      <Path d="M44.2941 40.8721H46.4244L45.3425 38.6096L44.2941 40.8721ZM43.9592 41.5974L43.3698 42.8651H42.4888L44.9205 37.8042H45.7712L48.243 42.8651H47.3755L46.766 41.5974H43.9592Z" fill="white" />
      <Path d="M95.2487 41.9821C94.7998 42.63 94.0361 43 92.8939 43C92.3212 43 91.8321 42.9064 91.4169 42.7155C90.5863 42.3455 90.124 41.5767 90.124 40.3943V40.3742C90.124 39.8115 90.2446 39.3344 90.4958 38.9357C90.9815 38.132 91.8658 37.6897 92.9811 37.6897C93.4499 37.6897 93.8518 37.7685 94.2337 37.9106C94.9841 38.2105 95.4997 38.7933 95.6639 39.6978H94.793C94.6289 38.9206 94.0293 38.4868 92.9879 38.4868C91.7418 38.4868 90.968 39.0997 90.968 40.3808V40.3878C90.968 41.5968 91.6681 42.2031 92.9409 42.2031C94.1266 42.2031 94.6759 41.6621 94.8133 40.8566H95.6906C95.6171 41.2854 95.473 41.6537 95.2487 41.9821Z" fill="white" />
      <Path d="M100.219 42.0171C100.812 41.7759 101.164 41.2553 101.164 40.3878C101.164 39.9389 101.084 39.5838 100.919 39.3057C100.591 38.7431 100.002 38.4868 99.2045 38.4868C98.0121 38.4868 97.2651 39.0714 97.2651 40.3808V40.3878C97.2651 40.7996 97.3454 41.1345 97.5096 41.4059C97.8413 41.9466 98.4275 42.2031 99.1978 42.2031C99.5863 42.2031 99.9314 42.1393 100.219 42.0171ZM97.7674 42.7223C96.9302 42.3369 96.4277 41.5902 96.4277 40.3878V40.366C96.4277 39.7964 96.5417 39.3125 96.7929 38.9138C97.2785 38.11 98.136 37.6897 99.2045 37.6897C99.7335 37.6897 100.206 37.7969 100.628 37.9961C101.479 38.4082 102.001 39.1987 102.001 40.3591V40.3943C102.001 40.9855 101.881 41.4629 101.633 41.8547C101.144 42.63 100.273 43 99.2045 43C98.665 43 98.1896 42.8998 97.7674 42.7223Z" fill="white" />
      <Path d="M103.776 42.8651H102.986V37.8042H103.763L105.816 40.1537L107.919 37.8042H108.65V42.8651H107.859V39.0084L105.836 41.2355H105.749L103.776 39.015V42.8651Z" fill="white" />
      <Path d="M110.699 40.5239H112.31C113.352 40.5239 113.801 40.2744 113.801 39.5476C113.801 39.2778 113.74 39.0786 113.633 38.9363C113.416 38.6516 112.96 38.5528 112.257 38.5528H110.699V40.5239ZM110.699 42.8651H109.896V37.8042H112.257C113.945 37.8042 114.618 38.3517 114.618 39.556C114.618 40.6863 113.865 41.2776 112.347 41.2708H110.699V42.8651Z" fill="white" />
      <Path d="M116.206 40.8721H118.336L117.255 38.6096L116.206 40.8721ZM115.871 41.5974L115.282 42.8651H114.401L116.833 37.8042H117.683L120.155 42.8651H119.288L118.678 41.5974H115.871Z" fill="white" />
      <Path d="M121.639 42.8651H120.849V37.8042H121.679L124.798 41.4635L124.982 41.7112V37.8042H125.769V42.8651H124.995L121.817 39.1355L121.639 38.9011V42.8651Z" fill="white" />
      <Path d="M128.529 40.7651L126.378 37.8042H127.38L128.971 40.0467L130.689 37.8042H131.687L129.38 40.7801V42.8651H128.529V40.7651Z" fill="white" />
    </Svg>
  );
}