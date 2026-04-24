"use client";

import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import Technical from "@/components/Technical";
import MyWork from "@/components/MyWork";
import MySkills from "@/components/MySkills";
import Bottom from "@/components/Bottom";

export default function Home() {
  return (
    <>
      <IntroSection />
      <Hero />
      <Technical />
      <MyWork />
      <MySkills />
      <Bottom />
    </>
  );
}
