import Image from "next/image";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "radix-connect-button": unknown;
    }
  }
}
const Layout = ({ children }) => {
  const bgColorClassName = "bg-gradient-to-r from-light-300 to-primary-100";

  return (
    <>
      <nav
        className={`py-6 pl-6 pr-8 border-b border-black flex flex-row justify-between ${bgColorClassName}`}
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
