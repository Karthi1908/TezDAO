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
import { ContractProvider, CONTRACT_ADDRESS, wallet } from '../../helper/tezos';


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

const UpdateMSStatus = ({pred} ) => {
  const colors = {
    bg: useColorModeValue('purple.200', 'purple.700'),
    text: useColorModeValue('blue', 'white'),
  };

  const submit = async (e) => {
    e.preventDefault();
    const { status } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);
	let id = pred.id;
	console.log(id, status.value);
	if (status.value === 'Approve'){
    contract.methods.multiSigApproval(id, 0).send();
	} else {
	contract.methods.multiSigApproval(id, 1).send();
	}
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
                    'Approve',
                    'Reject',
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

const AddMultisigProposal = () => {
  const [num, setNum] = React.useState(0);
  // const { connected, connect, activeAccount } = useWallet();
  const [options, setOptions] = React.useState({});

  const submit = async (e) => {
    e.preventDefault();
    const {  } = e.target.elements;

    const contract = await wallet.at(CONTRACT_ADDRESS);
	console.log(contract);

	const propValue = proposalRef.value;
	console.log(propValue);
	const quorumValue = parseInt(quorum.value);
	console.log(quorumValue);
	const amountValue = parseInt(amount.value);
	console.log(amountValue);
	const benefic = beneficiary.value;
	console.log(benefic);
	const currency = token.value;
	console.log(currency);
	
	
	
	const addprop = await contract.methods.multiSigProposal(
	amountValue,
	benefic,
	quorumValue,
	propValue,
	currency).send();
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Add New Multisig Proposal</Button>
      </PopoverTrigger>
      <PopoverContent padding="4">
        <form onSubmit={submit}>
          <FormControl>
            <FormLabel htmlFor="proposalRef">Proposal Reference</FormLabel>
            <Input name="proposalRef" id="proposalRef"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="beneficiary">Beneficiary</FormLabel>
            <Input name="beneficiary" id="beneficiary"></Input>
          </FormControl>
		  <FormControl>
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <Input type="number" id="amount"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="token">Token</FormLabel>
            <Input type="string" name="token" id="token"></Input>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="quorum">Quorum Required</FormLabel>
            <Input type="number" name="quorum" id="quorum"></Input>
          </FormControl>
          <Button type="submit">Submit</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default function MultiSig() {
 
  const msPropList = [];
  const _ = [];
  const { connected, connect, activeAccount } = useWallet();
  const [msList, setMsList] = React.useState([]);
  const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('blue', 'dark blue'),
  };

	React.useEffect(() => {(async() => {
	   
      if (!connected) {
        await connect();
      }
	  
	  if(activeAccount) {
	  const contract = await wallet.at(CONTRACT_ADDRESS);
	  const storage = await contract.storage();
	  const signers = await storage.multisig;
	  console.log(signers);
       console.log(activeAccount);
	  if (signers.includes(activeAccount.address)) {
		  console.log("Done");
      
      const multiSigProp = storage.multiSigProposals;
	  let msValue = [];	  
	  const counter = storage.msCounter;
      
      for (let pred =1; pred < counter; pred++  ) {
	  	 await multiSigProp.get(pred).then(value => { msPropList.push({ id: pred, value }) });
		  console.log(msPropList[pred-1].value.beneficiary);
		  let str = {id: pred, status:msPropList[pred-1].value.status, value : "Pay " + msPropList[pred-1].value.beneficiary + " " + msPropList[pred-1].value.amount.toString() + " " + msPropList[pred-1].value.tokenName};
		  _.push(str);
		 
			}
		console.log(msPropList);
		console.log(_);
		setMsList(_);
	}}})();
  }, [activeAccount]);

  return msList ? (
    <Container
      width="auto"
      maxWidth="100vw"
      bg={colors.bg}
      height="auto"
      maxHeight="100vh"
      padding="10vh"
    >
      <AddMultisigProposal />
	  
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {msList.map((pred, i) => {
          return (
            <Box
              key={i}
              // onClick={}
              display="flex"
              maxWidth="1000px"
              border="1px solid"
              borderRadius="15px"
              padding="20px"
              margin="10px"
            >
              
			  <Text color={colors.text}>{pred.value}</Text>
			  <Text color={colors.text}><b>&nbsp; Status :</b> &nbsp;{pred.status}</Text>
			  
              <UpdateMSStatus pred={pred} />
             
            </Box>
          );
        })}
      </Box>
    </Container>
  ) : (
    <Loading />
  );
}
