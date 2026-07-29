import Navbar from "@/components/website/Navbar";
import Hero from "@/components/website/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0C]">
      <Navbar />
      <Hero />
    </main>
  );
}