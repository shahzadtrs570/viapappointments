// import { cn } from "@package/utils"

import { cn } from "@package/utils"
import Image from "next/image"

type LogoProps = {
  color?: string
  className?: string
  hideOnMobile?: boolean
  textShow?: boolean
}

export function Logo({
  color = "white",
  className,
  hideOnMobile = false,
  textShow = true,
}: LogoProps) {
  return (
    <>
      <div className={cn("hidden", className)} style={{ color }} />
      <section
        className={cn(
          `flex flex-col items-start justify-center leading-none ${
            textShow ? "px-3 pt-3" : ""
          }`,
          hideOnMobile && "hidden md:flex"
        )}
      >
        <Image
          alt="Srenova Logo"
          className="mb-0"
          height={20}
          src="/logo-light-cropped.png"
          width={150}
        />
        {textShow && (
          <div className="flex w-[150px] justify-center">
            <span className="mt-0.5 text-[10px] font-normal tracking-wide text-gray-500">
              /Shre-no-vah/
            </span>
          </div>
        )}
      </section>
    </>
  )
}
