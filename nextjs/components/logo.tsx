import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="w-28 h-16 relative shrink-0">
        <Image
          priority={true}
          src={"/logo.svg"}
          fill={true}
          alt="solstice"
          className="shrink-0 hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};

export default Logo;
