import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const Effect2 = (props: SvgProps) => (
  <Svg
    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      fillOpacity={0.45}
      d="m18.25 14.4-1.55-1.5a5.251 5.251 0 0 0 .3-1.8c0-.783-.146-1.525-.438-2.225A5.427 5.427 0 0 0 15.25 7L11 2.8 8.8 4.95l-1.4-1.4L10.3.7c.1-.1.208-.175.325-.225A.942.942 0 0 1 11 .4c.133 0 .258.025.375.075.117.05.225.125.325.225l4.95 4.85a7.575 7.575 0 0 1 1.725 2.487A7.6 7.6 0 0 1 19 11.1a7.3 7.3 0 0 1-.2 1.725 8.386 8.386 0 0 1-.55 1.575Zm-.15 5.5-2.4-2.4a8.298 8.298 0 0 1-2.2 1.113A7.942 7.942 0 0 1 11 19c-2.216 0-4.104-.77-5.662-2.312C3.78 15.146 3 13.284 3 11.1c0-.85.134-1.666.4-2.45A8.175 8.175 0 0 1 4.6 6.4L1.1 2.9a.948.948 0 0 1-.275-.7c0-.283.092-.516.275-.7a.948.948 0 0 1 .7-.275c.284 0 .517.092.7.275l17 17a.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275ZM11 17c.6 0 1.171-.083 1.713-.25a6.569 6.569 0 0 0 1.537-.7L6 7.85a6.064 6.064 0 0 0-.762 1.6A5.755 5.755 0 0 0 5 11.1c0 1.634.584 3.025 1.75 4.175C7.917 16.425 9.334 17 11 17Z"
    />
  </Svg>
)
export default Effect2
