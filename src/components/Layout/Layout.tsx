import Image from "next/image";
import { ReactNode } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "radix-connect-button": unknown;
    }
  }
}

export type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const bgColorClassName = "bg-gradient-to-r from-light-300 to-primary-100";

  return (
    <>
      <nav
        className={`flex flex-row justify-between border-b border-black py-6 pl-6 pr-8 ${bgColorClassName}`}
      >
        <Image
          src="/logo.svg"
          alt="Next.js Logo"
          width={221}
          height={33}
          priority
        />
        <radix-connect-button />
      </nav>
      <main className={`${bgColorClassName}`}>{children}</main>
    </>
  );
};

export default Layout;
