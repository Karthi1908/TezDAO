import React from 'react';
import { OpKind } from '@taquito/taquito';
import {
  Box,
  Container,
  useColorModeValue,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  RadioGroup,
  Stack,
  Radio,
  NumberInput,
  NumberInputField,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
import PredictionContext from '../../helper/PredictionContext';
import { useParams  } from 'react-router-dom';
import { useWallet } from '../../helper/WalletContext';
import Loading from '../../helper/Loading';
import { CONTRACT_ADDRESS, TOKEN_ADDRESS, wallet } from '../../helper/tezos';

const VotingWindow = ({ id, options }) => {
console.log("options : ", options);
  const [request, setRequest] = React.useState({
    option: options[0],
    quantity: 0,
  });
  const { connect, disconnect, activeAccount, connected } = useWallet();

  const vote = async (e) => {
    e.preventDefault();
    const { option, quantity } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);
	const token = await wallet.at(TOKEN_ADDRESS);
	const storage =  await contract.storage();
	const tokenId = await storage.tokenRegister.get("TezDAO").id.toString();
    //const cid = await storage.tokenRegister.get("TezDAO").id.toString()
	console.log("contract", contract);
	console.log("token", token);
	console.log("tokenId", tokenId);
	console.log("activeAccount", activeAccount.address);
	id = Number(id);
	
	const batch = await wallet.batch()
		.withContractCall(token.methods.update_operators([{add_operator : {operator : CONTRACT_ADDRESS, owner : activeAccount.address, token_id : tokenId}}]))
		.withContractCall(contract.methods.voteOnProposal(parseFloat(quantity.value), id ,  option.value))
		.withContractCall(token.methods.update_operators([{remove_operator : {operator : CONTRACT_ADDRESS, owner : activeAccount.address, token_id : tokenId}}]))
	const batchOp = await batch.send();
	batchOp.confirmation();
	alert('Voted Sucessfully');

	
  };

  return (
    <Tabs variant="soft-rounded" width="100%">
      <TabList>
        <Tab>Options</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <form onSubmit={vote}>
            <Container
              padding={{ base: '0' }}
              display="flex"
              flexDirection="column"
            >
              <Box margin="3">
                <Text fontWeight="bold" fontSize="md">
                  Pick an option
                </Text>
                <RadioGroup
                  onChange={(e) =>
                    setRequest((request) => {
                      return {
                        ...request,
                        option: e,
                      };
                    })
                  }
                  value={request.option}
                  name="option"
                >
                  <Stack direction="column">
                    {options.map((option, i) => {
                      return (
                        <Radio key={i} value={option}>
                          <Box
                            borderWidth="1px"
                            borderColor="gray.400"
                            p="2"
                            borderRadius="2xl"
                          >
                            {option}
                          </Box>
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>
              </Box>
              <Box margin="3">
                <Text fontWeight="bold" fontSize="lg">
                  Amount to Stake
                </Text>
                <NumberInput
                  isRequired
                  placeholder="Shares"
                  onChange={(e) =>
                    setRequest((request) => {
                      return {
                        ...request,
                        quantity: e,
                      };
                    })
                  }
                  value={request.quantity}
                  name="quantity"
                >
                  <NumberInputField />
                </NumberInput>
              </Box>
              <Box margin="3">
                <Button type="submit">Vote</Button>
              </Box>
            </Container>
          </form>
        </TabPanel>
        <TabPanel>Lol2</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default function Propose() {
  
  let { id } = useParams();
  console.log( "ID ", id);
  let value = {}
  
  const { predictions, predictionsArray } = React.useContext(PredictionContext);
  const [data, setData] = React.useState(null);
  const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('blue', 'dark blue'),
    border: useColorModeValue('gray.900', 'gray.300'),
    cardBg: useColorModeValue('purple.200', 'purple.700'),
  };

  React.useEffect(async () => {
    
	const v = await predictions.get(id).then(value => {return value});
	console.log('V : ', v);
    setData({
      prediction: v.proposalName,
	  
      lastDate:
        new Date(v.endTime).toLocaleDateString() +
        ' ' +
        new Date(v.endTime).toLocaleTimeString(),
      key: id,
      ref: v.pID.toString(),
      pstatus: v.proposalStatus,
      pvolume: v.quorumRequired.toString(),
	  result: v.finalResult,
      options: v.proposalOptions,
	  type: v.resultType,
	  
      disclosure:""
        });

  }, []);

  return data ? (
    <Container
      maxWidth="100vw"
      width="auto"
      bg={colors.bg}
      color={colors.text}
      height="auto"
      minH="92vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      padding="0 15% 0 15%"
    >
      <Accordion allowToggle margin="6">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1">Please Read this before making any purchases</Box>
            </AccordionButton>
          </h2>
          <AccordionPanel p="6">{data.disclosure}</AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box
        p="6"
        maxW="max-content"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={colors.border}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
      >
        <Text fontSize="sm">Prediction id: {data.ref} </Text>

        <Text
          fontSize="lg"
          fontWeight="bold"
          margin={{ base: '1', md: '1' }}
          maxWidth="lg"
          overflow="visible"
          textOverflow="clip"
        >
          {data.prediction}
        </Text>
      </Box>
      <Box
        p="3"
        maxW="max-content"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={colors.border}
        overflow="hidden"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
      >
        <Box
          p="2"
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          borderColor={colors.border}
          bg={colors.cardBg}
          overflow="hidden"
          display="flex"
          flexDir="column"
          margin={{ base: '0', md: '2' }}
        >
          <Text fontSize="sm">Last Date</Text>
          <Text fontSize="l">{data.lastDate}</Text>
        </Box>
        <Box
          p="2"
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          borderColor={colors.border}
          bg={colors.cardBg}
          overflow="hidden"
          display="flex"
          flexDir="column"
          margin={{ base: '0', md: '2' }}
        >
          <Text fontSize="sm">Status</Text>
          <Text fontSize="l">{data.pstatus}</Text>
        </Box>
        <Box
          p="2"
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          borderColor={colors.border}
          bg={colors.cardBg}
          overflow="hidden"
          display="flex"
          flexDir="column"
          margin={{ base: '0', md: '2' }}
        >
          <Text fontSize="sm">Result</Text>
          <Text fontSize="l">{data.result}</Text>
        </Box>
      </Box>
      <Box
        margin="6"
        p={{ base: '2', md: '6' }}
        maxW="max-content"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={colors.border}
        overflow="hidden"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
      >
        <VotingWindow id={id} options={data.options} />
      </Box>
    </Container>
  ) : (
    <Loading />
  );
}
