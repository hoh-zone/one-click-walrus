import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { CoinStruct, GetAllCoinsParams, SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import { useEffect, useState } from "react";

export function Balance({ id }: { id: string }) {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [coins, setCoins] = useState<CoinStruct[]>([]);
  const [loading, setLoading] = useState(false);
  const [curSui, setSui] = useState(0);
  const [curWal, setWal] = useState(0);
  const [inputValue, setInputValue] = useState('1');
  const base = 1 * 10 ** 9;
  const walPackageId = "0x9f992cc2430a1f442ca7a5ca7638169f5d5c00e0ebc3977a65e9ac6e497fe5ef";
  const walModuleId = "wal_exchange";
  const exchangeObjectId = "0x0e60a946a527902c90bbc71240435728cd6dc26b9e8debc69f09b71671c3029b";

  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const fetchCoins = async (params: GetAllCoinsParams) => {
    try {
      const response = await suiClient.getAllCoins(params);
      const owner = params.owner;
      //setCoins(prevCoins => [...prevCoins, ...response.data]);
      setCoins(response.data);
      // if (response.hasNextPage) {
      //   // 如果还有下一页，递归调用fetchCoins，并传入下一页的cursor
      //   fetchCoins({
      //     cursor: response.nextCursor,
      //     owner
      //   });
      // }
    } catch (error) {
      console.error('Failed to fetch coins:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // console.log('currentAccount', currentAccount);
    if (currentAccount) {
      setLoading(true);
      fetchCoins({
        owner: currentAccount?.address as string,
      });
    }
  }, []);

  useEffect(() => {
    let suicount = 0;
    let walcount = 0;
    for (let index = 0; index < coins.length; index++) {
      const element = coins[index];

      if (element.coinType === '0x2::sui::SUI') {
        suicount += parseInt(element.balance);
      }
      if (element.coinType === '0x9f992cc2430a1f442ca7a5ca7638169f5d5c00e0ebc3977a65e9ac6e497fe5ef::wal::WAL') {
        walcount += parseInt(element.balance);
      }
      //console.log('element', element);
    }
    console.log('suicount', parseFloat((suicount / base).toFixed(2)));
    setSui(parseFloat((suicount / base).toFixed(2)));
    console.log('walcount', parseFloat((walcount / base).toFixed(2)));
    setWal(parseFloat((walcount / base).toFixed(2)));

  }, [coins]);

  if (loading) return <Text>Loading...</Text>;
  if (coins) {
    console.log('coins', coins);
  };

  const handleInputChange = (event) => {
    // 更新 input 的 state
    setInputValue(event.target.value);
  };

  const nowStartExchange = async () => {
    //alert('start exchange: ' + inputValue + ' Sui to WAL');

    if (confirm('confirm: ' + inputValue + ' Sui to WAL ?')) {

      // 用户点击了“确定”
      console.log('start...');
      // 在这里执行你的交换逻辑
      const tx = new Transaction();

      const to_add_amount = parseFloat(inputValue) * base;
      console.log('to_add_amount', to_add_amount);

      const sui_coin = tx.splitCoins(tx.gas, [tx.pure.u64(to_add_amount)]);//

      const wal_coin = await tx.moveCall({
        arguments: [
          tx.object(exchangeObjectId),
          sui_coin,
          tx.pure.u64(to_add_amount),
        ],
        target: `${walPackageId}::${walModuleId}::exchange_for_wal`,
      });
      tx.transferObjects([wal_coin, sui_coin], currentAccount.address);

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async () => {
            //await refetch();
          },
        },
      );

    } else {
      // 用户点击了“取消”
      console.log('cancel...');
    }

  };

  return (
    <>
      <Heading size="3">NowUser: {id}</Heading>

      <Flex direction="column" gap="2">

        <div>
          {
            coins && (
              <>
                <div>
                  {/* {coins.map((coin, index) => (
                  <div key={index}>
                  {coin.balance}|
                  {coin.coinType}
                  </div>
                  ))} */}
                  Sui: {curSui}
                </div>
                <div>
                  Wal: {curWal}
                </div>

                <Heading>Enter Sui to Exchange WAL</Heading>
                <Flex mt="5">
                  <input type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                  ></input>
                </Flex>
                <Button mt="5" onClick={nowStartExchange}>
                  <Text>exchange wal</Text>
                </Button>
              </>
            )
          }

        </div>

      </Flex>
    </>
  );
}


