import * as React from "react"
const Reply = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    transform="scale(1 -1)"
    viewBox="-2.4 -2.4 28.8 28.8"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M20 17v-1.2c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C17.72 11 16.88 11 15.2 11H4m0 0 4-4m-4 4 4 4"
    />
  </svg>
)
export default Reply