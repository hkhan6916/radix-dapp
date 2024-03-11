import {
  FungibleResourcesCollectionItem,
  FungibleResourcesCollectionItemVaultAggregated,
  StateEntityDetailsResponseItem,
} from "@radixdlt/radix-dapp-toolkit";

const getTokenMetadataValueByKey = (metadata: any, key: string) =>
  metadata?.items?.find((meta: any) => meta?.key === key)?.value?.typed?.value;

export type Resource = {
  symbol: string;
  iconUrl: string;
  resource_address: string;
  amount: string | undefined;
  // Tried to use rdt.gatewayApi.state.getEntityDetailsVaultAggregated but could not find the price in it's response hence it's hardcoded below.
  price: number;
};

const getSquashedTokenData = ({
  fungibleResources,
  swappableTokens,
}: {
  swappableTokens: null | StateEntityDetailsResponseItem[];
  fungibleResources: null | FungibleResourcesCollectionItemVaultAggregated[];
}): Resource[] => {
  const tokens = (swappableTokens || [])?.reduce(
    (resources: Resource[], currentToken: StateEntityDetailsResponseItem) => {
      const symbol = getTokenMetadataValueByKey(
        currentToken?.metadata,
        "symbol",
      );
      const iconUrl = getTokenMetadataValueByKey(
        currentToken?.metadata,
        "icon_url",
      );

      const fungibleResourceVaults = fungibleResources?.find(
        (resource: FungibleResourcesCollectionItem) =>
          resource.resource_address === currentToken?.address,
      )?.vaults;

      if (symbol) {
        resources.push({
          symbol,
          iconUrl,
          resource_address: currentToken.address,
          amount: fungibleResourceVaults?.items?.[0].amount,
          // Tried to use rdt.gatewayApi.state.getEntityDetailsVaultAggregated but could not find the price in it's response hence it's hardcoded below.
          price: symbol === "xUSDC" ? 1 : 1.109,
        });
      }

      return resources;
    },
    [],
  );

  return tokens;
};

export default getSquashedTokenData;
