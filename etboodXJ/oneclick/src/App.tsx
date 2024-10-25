import { ConnectButton, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { CoinStruct, GetAllCoinsParams } from "@mysten/sui/client";
import { Balance } from "./Balance";

function App() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });



  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>One Click Walrus (testnet)</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>

      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            <>
              <Balance id={currentAccount.address} />
            </>
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>

    </>
  );
}

export default App;

