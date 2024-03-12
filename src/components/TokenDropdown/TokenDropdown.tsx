import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Fragment, MouseEvent, useState } from "react";
import Image from "next/image";
import { Resource } from "@/util/helpers/getSquashedTokenData";
import { IoMdArrowDropdown } from "react-icons/io";

export type TokenDropdownProps = {
  tokens?: Resource[];
  selected?: Resource;
  onSelect?: (e: MouseEvent<HTMLDivElement>, token: Resource) => void;
} & Partial<typeof DropdownMenu.Root>; // Allow for forwarding any optional props to the base radix ui dropdown used in this component

/**
 * TokenDropdown
 *
 * Re-usable Token Dropdown Menu for allowing users to select a token.
 *
 * @property {Token[]} tokens - The token data to render.
 * @property {Token} selected - The selected token.
 * @property {function} onSelect - The token selection handler.
 */
const TokenDropdown = ({
  tokens = [],
  selected,
  onSelect = (token) => token,
  ...rest
}: TokenDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen} {...rest}>
      <DropdownMenu.Trigger>
        <button
          className={`flex min-w-[136px] items-center justify-between bg-light-500 px-3 py-2 text-dark-500 ${isOpen ? "rounded-t-lg border border-b-0 border-solid border-primary-300" : "rounded-full"}`}
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
          <span className={`ml-1 text-dark-400 ${isOpen ? "text-lg" : ""}`}>
            {selected?.symbol || "Select"}
          </span>

          <IoMdArrowDropdown
            color="#787882"
            className={`min-h-7 min-w-7 self-end ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[136px] rounded-b-lg border border-t-0 border-solid border-primary-300 bg-light-500">
        {tokens.map((token, i) =>
          isOpen &&
          token?.resource_address === selected?.resource_address ? null : (
            <Fragment key={`${token?.resource_address}${i}`}>
              <DropdownMenu.Item
                className={`flex cursor-pointer flex-row items-center rounded-b-lg px-3 py-2 hover:bg-light-300`}
                onClick={(e) => onSelect(e, token)}
              >
                <Image
                  height={32}
                  width={32}
                  src={token.iconUrl}
                  className="rounded-full"
                  alt="token icon image"
                />
                <span
                  className={`ml-1 text-dark-400 ${selected?.symbol === token?.symbol ? "ml-2 text-lg" : "text-base"}`}
                >
                  {token.symbol}
                </span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
            </Fragment>
          ),
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default TokenDropdown;
