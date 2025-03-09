import Image from "next/image";
import Link from "next/link";

const Logo = ({ className }: { className: string }) => {
  return (
    <Link href={"/"}>
      <div className={className}>
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
