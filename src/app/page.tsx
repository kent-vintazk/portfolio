"use client";

import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import MyWork from "@/components/MyWork";
import MySkills from "@/components/MySkills";
import KENTO_O from "@/components/KENTO_O";
import Bottom from "@/components/Bottom";

export default function Home() {
  return (
    <>
      <KENTO_O />
      <IntroSection />
      <Hero />
      <MyWork />
      <MySkills />
      <Bottom />
    </>
  );
}
