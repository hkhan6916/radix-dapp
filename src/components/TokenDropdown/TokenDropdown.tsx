import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";
import { MouseEvent, useState } from "react";
import Image from "next/image";
import { Token } from "@/pages";
import { Resource } from "@/util/helpers/getSquashedTokenData";

export type TokenDropdownProps = {
  tokens?: Resource[];
  selected?: Resource;
  onSelect?: (e: MouseEvent<HTMLDivElement>, token: Token) => void;
} & Partial<typeof DropdownMenu.Root>; // Allow for forwarding any optional props to the base radix ui dropdown used in this component

/**
 * TokenDropdown
 *
 * Re-usable Token Dropdown Menu for allowing users to select a token.
 *
 * @property {Token[]} tokens - The token data to render.
 * @property {Token} selected - The selected token.
 * @property {function} onSelect - A the select handler.
 */
const TokenDropdown = ({
  tokens = [],
  selected,
  onSelect = (token) => token,
  ...rest
}: TokenDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log({ tokens });
  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen} {...rest}>
      <DropdownMenu.Trigger>
        <Button
          className={`flex min-w-36 items-center bg-light-500 px-3 py-2 text-dark-500 ${isOpen ? "rounded-t-lg border border-b-0 border-solid border-primary-300" : "rounded-full"}`}
        >
          {!!selected?.iconUrl && (
            <Image
              height={32}
              width={32}
              src={selected.iconUrl}
              className="rounded-full"
              alt="Token image"
            />
          )}
          <span className={`text-dark-400 ${isOpen ? "text-lg" : ""}`}>
            {selected?.symbol || "Select"}
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-36 rounded-b-lg border border-t-0 border-solid border-primary-300 bg-light-500 px-3 py-2">
        {tokens.map((token, i) =>
          isOpen &&
          token?.resource_address === selected?.resource_address ? null : (
            <>
              <DropdownMenu.Item
                className={`flex cursor-pointer flex-row items-center`}
                onClick={(e) => onSelect(e, token)}
                key={`${token?.resource_address}${i}`}
              >
                <Image
                  height={32}
                  width={32}
                  src={token.iconUrl}
                  className="rounded-full"
                  alt="token icon image"
                />
                <span
                  className={`text-dark-400 ${selected?.symbol === token?.symbol ? "ml-2 text-lg" : "text-base"}`}
                >
                  {token.symbol}
                </span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
            </>
          ),
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default TokenDropdown;
