import Image from "next/image";
import FootballBetGenerator from "./FootballPage";

export default function Home() {
  return (
    <div className=" items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <FootballBetGenerator />
    </div>
  );
}
