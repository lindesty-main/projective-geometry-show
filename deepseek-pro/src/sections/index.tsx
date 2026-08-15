import { Hero } from "./Hero";
import { IntroSection } from "./IntroSection";
import { FirstPrincipleSection } from "./FirstPrincipleSection";
import { NearFarSection } from "./NearFarSection";
import { VanishingSection } from "./VanishingSection";
import { RailroadSection } from "./RailroadSection";
import { RationalSection } from "./RationalSection";
import { CircleEllipseSection } from "./CircleEllipseSection";
import { OutroSection } from "./OutroSection";

/** Ordered list of page sections. */
export const sections: { id: string; Component: React.ComponentType }[] = [
  { id: "intro", Component: IntroSection },
  { id: "first-principle", Component: FirstPrincipleSection },
  { id: "near-far", Component: NearFarSection },
  { id: "vanishing", Component: VanishingSection },
  { id: "railroad", Component: RailroadSection },
  { id: "rational-trees", Component: RationalSection },
  { id: "circle-ellipse", Component: CircleEllipseSection },
  { id: "outro", Component: OutroSection },
];

export { Hero };
