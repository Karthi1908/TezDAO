import React from 'react';
import PredictionContext from '../../helper/PredictionContext';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useWallet } from '../../helper/WalletContext';
import Loading from '../../helper/Loading';
import { CONTRACT_ADDRESS, wallet } from '../../helper/tezos';

const AddPredRes = ({ pred }) => {
  const colors = {
    bg: useColorModeValue('purple.200', 'purple.700'),
    text: useColorModeValue('blue', 'white'),
  };

  const submit = async (e) => {
    e.preventDefault();
    const { option } = e.target.elements;
    console.log(option.value);
    const contract = await wallet.at(CONTRACT_ADDRESS);
    contract.methods.predictResults(pred.id, option.value).send();
  };

  return (
    <Popover returnFocusOnClose={false} placement="right" closeOnBlur={false}>
      <PopoverTrigger>
        <Button bg={colors.bg} textColor={colors.text} marginLeft="10px">
          Result
        </Button>
      </PopoverTrigger>
      <PopoverContent textColor={colors.text}>
        <PopoverHeader fontWeight="semibold">
          Update proposal Result
        </PopoverHeader>
        <PopoverBody>
          <form onSubmit={submit}>
            <FormControl>
              <FormLabel htmlFor={pred.id + '_status'}>Options</FormLabel>
              <RadioGroup name="option">
                <Stack direction="column">
                  {pred.proposalOptions.map((option, i) => {
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
            </FormControl>
            <Button type="submit">Submit</Button>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const UpdatePredStatus = ({ pred }) => {
  const colors = {
    bg: useColorModeValue('purple.200', 'purple.700'),
    text: useColorModeValue('blue', 'white'),
  };

  const submit = async (e) => {
    e.preventDefault();
    const { status } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);
	let id = pred.pID.toNumber();
    contract.methods.updateStatus(id, status.value).send();
  };
  return (
    <Popover returnFocusOnClose={false} placement="right" closeOnBlur={false}>
      <PopoverTrigger>
        <Button bg={colors.bg} textColor={colors.text}>
          Update
        </Button>
      </PopoverTrigger>
      <PopoverContent textColor={colors.text}>
        <PopoverHeader fontWeight="semibold">
          Update proposal Status
        </PopoverHeader>
        <PopoverBody>
          <form onSubmit={submit}>
            <FormControl>
              <FormLabel htmlFor={pred.id + '_status'}>Status</FormLabel>
              <RadioGroup name="status">
                <Stack direction="column">
                  {[
                    'Voting In-Progress',
                    'Voting Ended',
                    'Cancelled',
                  ].map((option, i) => {
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
            </FormControl>
            <Button type="submit">Submit</Button>
          </form>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const AddNewproposal = () => {
  const [num, setNum] = React.useState(0);
  // const { connected, connect, activeAccount } = useWallet();
  const [options, setOptions] = React.useState({});

  const submit = async (e) => {
    e.preventDefault();
    const { proposal, resultRef, start, end, quorum, ptype } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);
	console.log(contract);
	const endValue = new Date(end.value).toISOString();
	console.log(endValue, end.value);
	const propValue = proposal.value;
	console.log(propValue);
	const optionValue = Object.keys(options).map((key) => options[key]);
	console.log(optionValue);
	const quorumValue = parseInt(quorum.value);
	console.log(quorumValue);
	const resultValue = resultRef.value;
	console.log(resultValue);
	const startValue = new Date(start.value).toISOString();
	console.log(startValue);
	const ptypeValue = ptype.value;
	console.log(ptypeValue);
	
	
	const addprop = await contract.methods.addProposal(
	endValue,
	propValue,
	optionValue,
	quorumValue,
	resultValue,
	startValue,
	ptypeValue ).send();
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Add New Proposal</Button>
      </PopoverTrigger>
      <PopoverContent padding="4">
        <form onSubmit={submit}>
          <FormControl>
            <FormLabel htmlFor="proposal">Proposal</FormLabel>
            <Input name="proposal" id="proposal"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="resultRef">Result Type</FormLabel>
            <Input name="resultRef" id="resultRef"></Input>
          </FormControl>
		  <FormControl>
            <FormLabel htmlFor="type">Proposal Type</FormLabel>
            <Input type="string" id="ptype"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="start">Start</FormLabel>
            <Input type="datetime-local" name="start" id="start"></Input>
          </FormControl>
		  <FormControl>
            <FormLabel htmlFor="end">End</FormLabel>
            <Input type="datetime-local" name="end" id="end"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="quorum">Quorum Required</FormLabel>
            <Input type="number" name="quorum" id="quorum"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="number_options">Number of Options</FormLabel>
            <Input
              onChange={(e) => {
                console.log(e);
                setNum(parseInt(e.target.value) || 0);
              }}
              name="number_options"
              id="number_options"
              type="number"
            ></Input>
          </FormControl>
          {[...Array(num).keys()].map((i) => {
            return (
              <FormControl>
                <FormLabel htmlFor={'option_' + i}>Option {i}</FormLabel>
                <Input
                  onChange={(e) =>
                    setOptions((options) => {
                      var opt = options;
                      opt[`option_${i}`] = e.target.value;
                      return opt;
                    })
                  }
                  name={`option_${i}`}
                  id={`option_${i}`}
                ></Input>
              </FormControl>
            );
          })}
          <Button type="submit">Submit</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default function MyPreds() {
  const { predictionsArray } = React.useContext(PredictionContext);
  
  const { connected, connect, activeAccount } = useWallet();
  const [myPreds, setMyPreds] = React.useState([]);
  const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('blue', 'dark blue'),
  };

  React.useEffect(() => {
    (async function () {
      if (!connected) {
        await connect();
      }
      if (activeAccount) {
		 // const _ = predictionsArray
        const _ = []; 
		for ( let x = 0 ; x < predictionsArray.length ; x++) {
			  
			  let item = predictionsArray[x].value;
			 // if (item.proposer === activeAccount.address) {
				_.push(item);
				
			 // }
		}
			
		//predictionsArray.forEach(
       //   (item) => item.proposer === activeAccount.address
		// item => item.values()
	   // const _ = predictionsArray.value
       //);

        setMyPreds(_);
      }
    })();
  }, [activeAccount]);

  return myPreds ? (
    <Container
      width="auto"
      maxWidth="100vw"
      bg={colors.bg}
      height="auto"
      maxHeight="100vh"
      padding="10vh"
    >
      <AddNewproposal />
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {myPreds.map((pred, i) => {
          return (
            <Box
              key={i}
              // onClick={}
              display="flex"
              maxWidth="300px"
              border="1px solid"
              borderRadius="15px"
              padding="20px"
              margin="10px"
            >
              <Text color={colors.text}>{pred.proposalName}</Text>
              <UpdatePredStatus pred={pred} />
             
            </Box>
          );
        })}
      </Box>
    </Container>
  ) : (
    <Loading />
  );
}
