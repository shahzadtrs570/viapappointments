import Image from "next/image"

export function ChatHeader({
  header,
  image,
}: {
  header: string
  image: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-[50px]">
        <Image
          alt="Chat background"
          className="absolute inset-0"
          height={50}
          src={image}
          width={50}
        />
      </div>
      <span className="font-bold">{header}</span>
    </div>
  )
}
