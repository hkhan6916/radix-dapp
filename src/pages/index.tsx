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
import Lottie from "react-lottie-player";
import successLottie from "../lotties/success.json";
import { ImArrowDown } from "react-icons/im";

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
  const [transactionInProgress, setTransactionInProgress] = useState(false);

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

  // Uses the stateEntityDetails method to get detailed info on a resource from our config e.g. the XRD token.
  const getSwappableTokensEntityDetails = useCallback(async () => {
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

  const handleTransaction = async () => {
    setTransactionInProgress(true);

    const swapManifest = swapTokenManifest({
      accountAddress: account?.address as AccountAddress,
      fromTokenAddress: tokenFrom?.resource_address as ResourceAddress,
      swapperComponentAddress: config.components.swapper,
      amount: tokenFromAmount,
    });
    const result = await radix?.walletApi.sendTransaction({
      transactionManifest: swapManifest,
    });
    if (result?.isOk) {
      // @ts-expect-error // result?.error?.error is not undefined and returns a string.
      if (result?.error?.error) {
        setTransactionFailed(true);
        setTransactionInProgress(false);
      } else {
        setTransactionComplete(true);
      }
      setTransactionInProgress(false);
      return;
    }
    if (result?.isErr) {
      setTransactionFailed(true);
      setTransactionInProgress(false);
      return;
    }
  };

  // Handles the token data on load
  const handleTokenDetails = useCallback(
    async (accountData: StateEntityDetailsVaultResponseItem | null) => {
      const swappableTokensEntityDetails =
        await getSwappableTokensEntityDetails();

      const accountFungibleTokens = getSquashedTokenData({
        accountFungibleResources:
          accountData?.fungible_resources?.items || null,
        swappableTokensEntityDetails:
          swappableTokensEntityDetails?.items || null,
      });

      setFungibleTokens(accountFungibleTokens);
      setTokenFrom(accountFungibleTokens[0]);
      setTokenTo(accountFungibleTokens[1]);
    },
    [getSwappableTokensEntityDetails],
  );

  useEffect(() => {
    const subscription = radix?.walletApi.walletData$.subscribe(
      async (walletData) => {
        if (walletData?.accounts?.[0]) {
          radix?.gatewayApi.state
            .getEntityDetailsVaultAggregated(walletData?.accounts?.[0]?.address)
            ?.then(async (accountData) => {
              console.log({ accountData });
              setAccount(accountData);

              handleTokenDetails(accountData);
            });
        } else {
          handleTokenDetails(null);
        }
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [radix, getSwappableTokensEntityDetails, handleTokenDetails]);

  if (!fungibleTokens) return null;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center">
      <div className="relative flex min-h-[360px] max-w-[460px] flex-1 flex-col rounded-[20px] bg-white px-5 pb-6 pt-7">
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
              <div className="flex flex-1 flex-col items-center justify-center">
                <Lottie
                  loop={false}
                  animationData={successLottie}
                  play
                  style={{ width: 150, height: 150 }}
                />
                <span className="text-center text-2xl font-semibold text-primary-300">
                  Your transaction was a success, {tokenFromAmount}{" "}
                  {tokenFrom?.symbol} are now in your wallet.
                </span>
              </div>
            ) : (
              <span className="text-center text-2xl font-semibold text-error-500">
                Upss, something went wrong
              </span>
            )}
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center">
            <div className="group mb-3 flex h-28 items-center justify-center rounded-xl border border-solid border-primary-300 bg-light-400 px-4">
              <div className="flex flex-col">
                <span className="text-sm text-dark-400">You pay</span>
                <input
                  className="w-full bg-light-400 text-3xl text-dark-500 outline-none"
                  value={tokenFromAmount}
                  disabled={
                    !account ||
                    tokenFrom?.resource_address === tokenTo?.resource_address ||
                    transactionInProgress
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
            <div className="absolute -mt-20 flex size-10 items-center justify-center rounded-lg border border-solid border-primary-300 bg-light-300">
              <ImArrowDown size={20} color="#8481E1" />
            </div>
            <div className="group flex h-28 items-center justify-center rounded-xl border border-solid border-primary-300 bg-light-400 px-4">
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
              className="mt-5"
              onClick={() => handleTransaction()}
              disabled={!isValidateTransaction() || transactionInProgress}
              loading={transactionInProgress}
            >
              Send to the Radix Wallet
            </Button>
          </div>
        )}
        {Number(tokenFrom?.amount) < tokenFromAmount && (
          <small className="mt-3 text-red-700">
            You do not have enough {tokenFrom?.symbol} for this trade. You have{" "}
            {tokenFrom?.amount} {tokenFrom?.symbol}.
          </small>
        )}
      </div>
    </div>
  );
}
