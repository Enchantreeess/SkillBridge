"use client"

import Hero from "./components/Hero"
import Marquee from "./components/Marquee"
import SkillDiscoveryWheel from "./components/SkillDiscoveryWheel"
import InteractiveRoadmap from "./components/InteractiveRoadmap"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Marquee />
      <SkillDiscoveryWheel />
      <InteractiveRoadmap />
    </div>
  )
}
