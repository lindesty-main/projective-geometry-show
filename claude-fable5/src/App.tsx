import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import {
  FormulaSection,
  SinSection,
  IrreversibleSection,
  VanishingSection,
  RailroadSection,
  OrchardSection,
  EllipseSection,
} from '@/components/sections/ContentSections'
import { Outro } from '@/components/sections/Outro'

export default function App() {
  return (
    <div id="top">
      <Nav />
      <Hero />
      <main>
        <FormulaSection />
        <SinSection />
        <IrreversibleSection />
        <VanishingSection />
        <RailroadSection />
        <OrchardSection />
        <EllipseSection />
      </main>
      <Outro />
    </div>
  )
}
