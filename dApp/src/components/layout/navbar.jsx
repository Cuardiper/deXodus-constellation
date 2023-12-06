import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

export const Navbar = () => {
  const router = useRouter();

  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(!active);
  };

  const categories = [
    {
      name: "Trade",
      path: "/",
      icon: "",
    },
    {
      name: "Protocol",
      path: "/protocol",
      icon: "",
    },
    {
      name: "My guardians",
      path: "/collection",
      icon: "",
    },
    {
      name: "Use guide",
      path: "/testnet",
      icon: "",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#0d1116]">
      <nav className="flex justify-between items-center flex-wrap sticky top-0 border-b border-zinc-900 z-30 w-full p-2 sm:p-3 my-auto">
        <div className="text-white font-semibold flex felx-col my-auto lg:my-0 lg:flex-row items-center flex-shrink-0 mr-6 lg:mr-10 lg:ml-5 lg:pt-1 text-2xl">
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <Image
              src="/images/dexLogo_fit.png"
              width={40}
              height={40}
              alt="logo"
            />
            <div className="ml-2 bg-gradient-to-r from-[#DC2368] via-[#861E6E] to-[#BB2C54] bg-clip-text text-transparent font-bold">
              de
              <span className="bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                X
              </span>
              odus
            </div>
          </Link>
        </div>
        <button
          className="p-3 rounded lg:hidden text-white ml-auto outline-none"
          onClick={handleClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div
          className={`${
            active ? "pt-4" : "hidden"
          }   w-full lg:w-auto lg:inline-flex lg:flex-grow lg:pt-0`}
        >
          <div className="lg:inline-flex lg:flex-row w-full lg:items-center items-start font-bold flex flex-col lg:h-auto gap-5">
            {categories.map((category) => (
              <div key={category.name} className={`items-center flex flex-row`}>
                {category.path.startsWith("http") ? (
                  <a
                    href={category.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`lg:inline-flex lg:w-auto w-full py-2 pl-4 rounded items-center justify-center hover:text-white/80 ${
                      category.path === router.pathname
                        ? "text-white/80"
                        : category.path == "/testnet"
                        ? "text-yellow-500"
                        : ""
                    }`}
                    onClick={() => setActive(false)}
                  >
                    <i
                      className={`bi bi-${category.icon} text-xl text-white mr-2`}
                    ></i>
                    {category.name}
                  </a>
                ) : (
                  <Link
                    href={category.path}
                    className={`lg:inline-flex lg:w-auto w-full py-2 pl-4 rounded items-center justify-center hover:text-white/80 ${
                      category.path === router.pathname
                        ? "text-white"
                        : category.path == "/testnet"
                        ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent"
                        : "text-white/70"
                    }`}
                    onClick={() => setActive(false)}
                  >
                    <i
                      className={`bi bi-${category.icon} text-xl text-white mr-2`}
                    ></i>
                    {category.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex items-center items-start lg:ml-auto ml-4 lg:ml-0mr-3">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
