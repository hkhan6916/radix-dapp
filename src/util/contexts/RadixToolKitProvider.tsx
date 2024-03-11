import { PropsWithChildren, useContext } from "react";
import { RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit";
import RadixToolkitProviderContext from "./RadixToolkitProviderContext";

export type RadixToolKitProviderProps = PropsWithChildren & {
  radix: RadixDappToolkit | null;
};

/**
 * RadixToolKitProvider
 *
 * A provider for globally hydrating down the radixDappToolkit from the @radixdlt/radix-dapp-toolkit sdk
 *
 * @author - Haroon Khan <https://github.com/hkhan6916>
 *
 * @param {ReactNode} [children] - The app to wrap with the provider so it may have access to the radix toolkit
 * @param {Radix} radix - A configured invocation of RadixDappToolkit used mainly for providing access to methods to interface with the radix wallet API
 */
const RadixToolKitProvider = ({
  children,
  radix,
}: RadixToolKitProviderProps) => {
  return (
    <RadixToolkitProviderContext.Provider value={radix}>
      {children}
    </RadixToolkitProviderContext.Provider>
  );
};

const useRadixToolkit = () => useContext(RadixToolkitProviderContext);

export { RadixToolKitProvider, useRadixToolkit };
