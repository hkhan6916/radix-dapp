import {
  EntityMetadataItem,
  FungibleResourcesCollectionItem,
  FungibleResourcesCollectionItemVaultAggregated,
  StateEntityDetailsResponseItem,
} from "@radixdlt/radix-dapp-toolkit";

// Basic function to get a value from the StateEntityDetailsResponseItem object based on a key e.g. "iconUrl" for a resource.
const getTokenMetadataValueByKey = (
  metadata: { items?: EntityMetadataItem[] } | undefined,
  key: string,
): unknown => {
  return metadata?.items?.find((meta: EntityMetadataItem) => meta.key === key)
    ?.value?.typed;
};
export type Resource = {
  symbol: string;
  iconUrl: string;
  resource_address: string;
  amount: string | undefined;
  price: number;
};

/**
 * getSquashedTokenData
 *
 * A function which uses data from fungibleResources object from an account and the stateEntityDetails call for each resource to create a simplified object containing all the data needed for the validation and execution of a transaction.
 *
 * @param {null | FungibleResourcesCollectionItemVaultAggregated[]} accountFungibleResources - The fungible resources for an account. This is needed for the amount of a resource an account holds.
 * @param {null | null | StateEntityDetailsResponseItem[]} accountFungibleResources -
 */
const getSquashedTokenData = ({
  accountFungibleResources,
  swappableTokensEntityDetails,
}: {
  swappableTokensEntityDetails: null | StateEntityDetailsResponseItem[];
  accountFungibleResources:
    | null
    | FungibleResourcesCollectionItemVaultAggregated[];
}): Resource[] => {
  const tokens = (swappableTokensEntityDetails || [])?.reduce(
    (resources: Resource[], currentToken: StateEntityDetailsResponseItem) => {
      const symbol = getTokenMetadataValueByKey(
        currentToken?.metadata,
        "symbol",
      ) as { value: string };
      const iconUrl = getTokenMetadataValueByKey(
        currentToken?.metadata,
        "icon_url",
      ) as { value: string };

      const fungibleResourceVaults = accountFungibleResources?.find(
        (resource: FungibleResourcesCollectionItem) =>
          resource.resource_address === currentToken?.address,
      )?.vaults;

      if (symbol) {
        resources.push({
          symbol: symbol?.value as string,
          iconUrl: iconUrl?.value as string,
          resource_address: currentToken.address,
          amount: fungibleResourceVaults?.items?.[0].amount,
          // Tried to use rdt.gatewayApi.state.getEntityDetailsVaultAggregated but could not find the price in it's response hence it's hardcoded below.
          price: symbol?.value === "xUSDC" ? 1 : 1.109,
        });
      }

      return resources;
    },
    [],
  );

  return tokens;
};

export default getSquashedTokenData;
