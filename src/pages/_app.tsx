import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { RadixToolKitProvider } from "@/util/contexts";
import {
  DataRequestBuilder,
  RadixDappToolkit,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [radix, setRadix] = useState<RadixDappToolkit | null>(null);

  // Initialize Radix Dapp Toolkit in the client
  useEffect(() => {
    const radixDappToolkit = RadixDappToolkit({
      dAppDefinitionAddress:
        "account_tdx_2_12xhrq9v2sld9ss4kx066d6n7gv80q85g5flqeyla8vcfms5m35zk2n",
      networkId: RadixNetwork.Stokenet,
      applicationName: "Radix Web3 dApp",
      applicationVersion: "1.0.0",
    });

    radixDappToolkit.walletApi.setRequestData(
      DataRequestBuilder.accounts().atLeast(1),
    );

    radixDappToolkit.buttonApi.setTheme("white-with-outline");

    setRadix(radixDappToolkit);

    return () => {
      radixDappToolkit.destroy();
    };
  }, []);

  return (
    <RadixToolKitProvider radix={radix}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RadixToolKitProvider>
  );
}
