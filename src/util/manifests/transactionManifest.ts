import { AccountAddress, ComponentAddress, ResourceAddress } from "../config";

export type SwapToken = {
  accountAddress: AccountAddress;
  fromTokenAddress: ResourceAddress;
  swapperComponentAddress: ComponentAddress;
  amount: number;
};

/**
 * swapToken
 *
 * A function which creates a transcation manifest based on it's arguements
 *
 * @param {AccountAddress} accountAddress - The associated account address for the transaction.
 * @param {ResourceAddress} fromTokenAddress - The address for the token to swap.
 * @param {ComponentAddress} swapperComponentAddress - The address for the swapper component.
 * @param {number} amount - The amount of the selected token to swap.
 */
export const swapTokenManifest = ({
  accountAddress,
  fromTokenAddress,
  swapperComponentAddress,
  amount,
}: SwapToken) => {
  return `CALL_METHOD
    Address("${accountAddress}")
    "withdraw"
    Address("${fromTokenAddress}")
    Decimal("${amount}")
;

TAKE_ALL_FROM_WORKTOP
    Address("${fromTokenAddress}")
    Bucket("xrd_bucket")
;

CALL_METHOD
    Address("${swapperComponentAddress}")
    "swap"
    Bucket("xrd_bucket")
;

CALL_METHOD
    Address("${accountAddress}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;`;
};
