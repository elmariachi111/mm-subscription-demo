import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { Account } from "../components/Account";
import { useWeb3 } from "../components/Web3Context";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const Home: NextPage = () => {
  
  const { web3, account } = useWeb3(); 

  const [confirmations, setConfirmations] = useState<any[]>([]);
  const [receipt, setReceipt] = useState<any>();

  const trackConfirmation = useCallback((confirmation: number) => {
    console.log(confirmation);
    setConfirmations(old => ([...old, confirmation]));
  },[])

  const sendTx = useCallback(async () => {
    if (!web3 || !account) return;
    
    const tx = web3.eth.sendTransaction({
      from: account,
      to: ADDRESS_ZERO,
      value: web3.utils.toWei("0.0001", "ether")
    })

    tx.on("confirmation", trackConfirmation);
    tx.on("receipt", r => {
      console.log(r);
      setReceipt(r)
    });
    
  },[web3,  account, trackConfirmation])

  return (
    <Container maxW="container.xl" p="2" h="100vh" as={Flex} direction="column">
      <Head>
        <title>listen to events</title>
      </Head>
      <Flex justify="space-between" align="center" my={12}>
        <Heading>listen to events</Heading>
        <Account />
      </Flex>
      <Button onClick={sendTx}>send tx</Button>
      <Flex direction="column" gap={3}>
        <Text>Confirmations: {confirmations.length}</Text>
        {receipt && <Text>Transaction Hash: {receipt.transactionHash}</Text>}
      </Flex>
    </Container>
  );
};

export default Home;
