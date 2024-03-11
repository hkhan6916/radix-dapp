import { RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit";
import { createContext } from "react";

/**
 * Type - Radix
 *
 * A type to describe the params for the RadixDappToolkit function which returns an object containing methods.
 */
export type Radix = ReturnType<typeof RadixDappToolkit>;

const RadixToolkitProviderContext = createContext<Radix | null>(null);

export default RadixToolkitProviderContext;
