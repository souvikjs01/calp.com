import Cta from "@/components/hero/Cta";
import Features from "@/components/hero/Features";
import Hero from "@/components/hero/Hero";
import Logo from "@/components/hero/Logo";
import Testimonials from "@/components/hero/Testimonials";
import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  if(session?.user) {
    return redirect('/dashboard')
  }
  return (
    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
      <Logo />
      <Features />
      <Testimonials />
      <Cta />
    </div>
  );
}
