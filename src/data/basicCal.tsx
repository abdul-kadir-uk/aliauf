import BasicCal from "../types/basicCal";

const basicCal: BasicCal[] = [
  { label: "%" },
  { label: "clear" },
  {
    label: (
      <span>
        x<sup>3</sup>
      </span>
    ),
    value: "cube",
  },
  { label: "⌫" },
  {
    label: (
      <span>
        1<sub>/x</sub>
      </span>
    ),
    value: "inverse",
  },
  {
    label: (
      <span>
        x<sup>2</sup>
      </span>
    ),
    value: "square",
  },
  {
    label: (
      <span>
        <sup>2</sup>√x
      </span>
    ),
    value: "sqrt",
  },
  { label: "/" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "*" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "-" },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "+" },
  { label: "+/-" },
  { label: "0" },
  { label: "." },
  { label: "=" },
];

export default basicCal;
