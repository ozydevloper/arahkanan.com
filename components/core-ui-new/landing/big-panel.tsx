import Image from "next/image";

export const BigPanel = () => {
  return (
    <div className="items-center justify-center flex">
      <div className="w-full md:w-[1150px] h-[130px] md:h-[400px] relative md:rounded-2xl  overflow-hidden">
        <Image
          src={"/lan.webp"}
          alt=".."
          fill
          className="object-center blur-md scale-110"
          priority={false}
        />
        <Image
          src={"/lan.webp"}
          alt="..."
          fill
          className="md:object-cover object-contain"
          priority
        />
      </div>
    </div>
  );
};
