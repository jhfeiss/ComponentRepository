// src/components/LoadingSpinner/LoadingSpinner.tsx
import { jsx } from "react/jsx-runtime";
var LoadingSpinner = ({
  size = 40,
  color = "#ffffff"
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "loading-spinner",
      style: {
        width: size,
        height: size,
        borderTopColor: color
      }
    }
  );
};
export {
  LoadingSpinner
};
