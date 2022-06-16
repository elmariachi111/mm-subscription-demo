import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useWeb3 } from "./Web3Context";

const Account = () => {
  const { account, connect, chainId } = useWeb3();

  return account ? (
    <Flex direction="column" align="flex-end">
      <Text>{account}</Text>
      <Text>{chainId}</Text>
    </Flex>
  ) : (
    <Button onClick={() => connect()}>connect</Button>
  );
};

export { Account };
