import { PrefixedString } from "./globalTypes";

export type Ticker = "XRD" | "xUSDC";

export type ResourceAddress = PrefixedString<"resource_">;
export type AccountAddress = PrefixedString<"account_">;
export type ComponentAddress = PrefixedString<"component_">;

export type Resource = {
  [key in Ticker]: {
    address: ResourceAddress;
    bucket: string;
  };
};

export type Component = {
  swapper: ComponentAddress;
};

export type Config = {
  resources: Resource;
  components: Component;
  dAppDefinitionAddress: AccountAddress;
};

export const config = <Config>{
  resources: {
    XRD: {
      address:
        "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc",
      bucket: "xrd_bucket",
      price: 1.1,
    },
    xUSDC: {
      address:
        "resource_tdx_2_1t57hhmgr3pm0mycrasa7xv5uf93ffqspa5zsczvdn6h4ukfxfu87fc",
      bucket: "xusdc_bucket",
      price: 1,
    },
  },
  components: {
    swapper:
      "component_tdx_2_1cqlgeal4j66v95xvg2xzdjum4etku3mg9xhesntpvqj7fl5adjx96w",
  },
  dAppDefinitionAddress:
    "account_tdx_2_12xhrq9v2sld9ss4kx066d6n7gv80q85g5flqeyla8vcfms5m35zk2n",
};
