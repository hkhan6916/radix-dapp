import { useRadixToolkit } from "@/util/contexts";
import { useCallback, useEffect, useState } from "react";
import { StateEntityDetailsVaultResponseItem } from "@radixdlt/radix-dapp-toolkit";
import { Button } from "@/components/Button";
import getSquashedTokenData, {
  Resource,
} from "@/util/helpers/getSquashedTokenData";
import { AccountAddress, ResourceAddress, Ticker, config } from "@/util/config";
import { TokenDropdown } from "@/components/TokenDropdown";
import { swapTokenManifest } from "@/util/manifests/transactionManifest";
import { IoIosClose } from "react-icons/io";

export type Token = {
  symbol: string;
  iconUrl: string;
  resource_address: ResourceAddress;
  amount: string;
  price: number;
};

export default function Home() {
  const [tokenFrom, setTokenFrom] = useState<null | Resource>(null);
  const [tokenTo, setTokenTo] = useState<null | Resource>(null);
  const [tokenFromAmount, setTokenFromAmount] = useState(0);
  const [tokenToAmount, setTokenToAmount] = useState(0);
  const [account, setAccount] =
    useState<StateEntityDetailsVaultResponseItem | null>(null);
  const [fungibleTokens, setFungibleTokens] = useState<Resource[]>();
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [transactionFailed, setTransactionFailed] = useState(false);

  const radix = useRadixToolkit();

  const isValidateTransaction = () => {
    let isValid = true;
    if (
      tokenFrom &&
      tokenTo &&
      tokenFrom?.resource_address === tokenTo?.resource_address
    ) {
      isValid = false;
    }
    if (!tokenFromAmount) {
      isValid = false;
    }
    return isValid;
  };

  const getSwappableTokenData = useCallback(async () => {
    const addresses = Object.keys(config?.resources)?.map(
      (key) => config?.resources[key as Ticker]?.address,
    );

    if (addresses?.length) {
      return await radix?.gatewayApi.state.innerClient
        .stateEntityDetails({
          stateEntityDetailsRequest: {
            addresses,
          },
        })
        ?.then((tokenData) => {
          return tokenData;
        });
    }
  }, [radix]);

  useEffect(() => {
    const subscription = radix?.walletApi.walletData$.subscribe(
      async (walletData) => {
        if (walletData?.accounts?.[0]) {
          radix?.gatewayApi.state
            .getEntityDetailsVaultAggregated(walletData?.accounts?.[0]?.address)
            ?.then(async (accountData) => {
              console.log({ accountData });
              setAccount(accountData);

              const swappableTokens = await getSwappableTokenData();

              const accountFungibleTokens = getSquashedTokenData({
                fungibleResources:
                  accountData?.fungible_resources?.items || null,
                swappableTokens: swappableTokens?.items || null,
              });

              setFungibleTokens(accountFungibleTokens);
              setTokenFrom(accountFungibleTokens[0]);
              setTokenTo(accountFungibleTokens[1]);
            });
        } else {
          const swappableTokens = await getSwappableTokenData();
          // accountData?.fungible_resources?.items,

          const accountFungibleTokens = getSquashedTokenData({
            fungibleResources: null, //accountData?.fungible_resources?.items,
            swappableTokens: swappableTokens?.items || null,
          });

          setFungibleTokens(accountFungibleTokens);
          setTokenFrom(accountFungibleTokens[0]);
          setTokenTo(accountFungibleTokens[1]);
        }
        // doSomethingWithAccounts(walletData.accounts)
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [radix, getSwappableTokenData]);

  if (!fungibleTokens) return null;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center">
      <div className="relative flex min-h-[360px] max-w-[460px] flex-1 rounded-[20px] bg-white px-5 py-7">
        {(transactionComplete || transactionFailed) && (
          <button
            className="border-none bg-transparent"
            onClick={() => {
              if (transactionComplete) {
                setTokenFromAmount(0);
                setTokenToAmount(0);
              }

              setTransactionComplete(false);
              setTransactionFailed(false);
            }}
          >
            <IoIosClose
              size={40}
              color="#787882"
              className="absolute right-4 top-4"
            />
          </button>
        )}
        {transactionComplete || transactionFailed ? (
          <div className="flex flex-1 items-center justify-center">
            {transactionComplete ? (
              <span className="text-center text-2xl font-semibold text-primary-300">
                Your transaction was a success, {tokenFromAmount}{" "}
                {tokenFrom?.symbol} are now in your wallet
              </span>
            ) : (
              <span className="text-center text-2xl font-semibold text-error-500">
                Upss, something went wrong
              </span>
            )}
          </div>
        ) : (
          <div>
            <div className="group flex h-28 items-center justify-center bg-light-400 ">
              <div className="flex flex-col">
                <span className="text-sm text-dark-400">You pay</span>
                <input
                  className="w-full bg-light-400 text-3xl text-dark-500 outline-none"
                  value={tokenFromAmount}
                  disabled={
                    !account ||
                    tokenFrom?.resource_address === tokenTo?.resource_address
                  }
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      setTokenFromAmount(value);

                      // Calculate the conversion ratio
                      const conversionRatio =
                        (tokenTo?.price || 0) / (tokenFrom?.price || 0);

                      // Convert the amount from 'fromToken' to 'toToken'
                      const convertedAmount = value * conversionRatio;
                      setTokenToAmount(convertedAmount);
                    }
                  }}
                />
              </div>

              <TokenDropdown
                tokens={fungibleTokens}
                onSelect={(_, token) => {
                  setTokenFrom(token);
                }}
                selected={tokenFrom || fungibleTokens?.[0]}
              />
            </div>

            <div className="group flex h-28 items-center justify-center bg-light-400 ">
              <div className="flex flex-col">
                <span className="text-sm text-dark-400">You receive</span>
                <input
                  disabled
                  className="w-full bg-light-400 text-3xl text-dark-500 outline-none"
                  value={tokenToAmount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      setTokenFromAmount(value);
                    }
                  }}
                />
              </div>

              <TokenDropdown
                tokens={fungibleTokens}
                onSelect={(_, token) => {
                  setTokenTo(token);
                }}
                selected={tokenTo || fungibleTokens?.[1]}
              />
            </div>
            <Button
              onClick={async () => {
                const swapManifest = swapTokenManifest({
                  accountAddress: account?.address as AccountAddress,
                  fromTokenAddress:
                    tokenFrom?.resource_address as ResourceAddress,
                  swapperComponentAddress: config.components.swapper,
                  amount: tokenFromAmount,
                });
                console.log({ swapManifest });
                const result = await radix?.walletApi.sendTransaction({
                  transactionManifest: swapManifest,
                });
                if (result?.isOk) {
                  if (result?.error?.error) {
                    setTransactionFailed(true);
                  } else {
                    setTransactionComplete(true);
                  }

                  return;
                }
                if (result?.isErr) {
                  setTransactionFailed(true);
                  return;
                }
              }}
              disabled={!isValidateTransaction()}
            >
              Send to the Radix Wallet
            </Button>
          </div>
        )}
        {Number(tokenFrom?.amount) < tokenFromAmount && (
          <small className="text-red-700">
            You do not have enough {tokenFrom?.symbol} for this trade. You have{" "}
            {tokenFrom?.amount} {tokenFrom?.symbol}.
          </small>
        )}
      </div>
    </div>
  );
}
