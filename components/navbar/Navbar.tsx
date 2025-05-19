import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png"
import AuthModel from "./AuthModel";
import { ThemeToggle } from "../theme/ThemeToggle";
export default function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href='/' className=" flex items-center gap-2">
        <Image src={Logo} alt="logo" className=" size-10 " />
        <h1 className=" text-3xl font-bold">Caln.com</h1>
      </Link>
      
      <div className="hidden md:flex md:justify-end md:space-x-4">
        <ThemeToggle />
        <AuthModel />
      </div>
    </div>
  )
}
