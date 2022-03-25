import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useWallet } from '../helper/WalletContext';
import { CONTRACT_ADDRESS, wallet } from '../helper/tezos';

const Redeem = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submit = async (e) => {
    e.preventDefault();
    const { tokenId, amount } = e.target.elements;
    console.log(tokenId.value, amount.value);
    const contract = await wallet.at(CONTRACT_ADDRESS);

    await contract.methods
      .unStakeTokens(0)
      .send();
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Redeem</MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unstake Tokens</ModalHeader>
          <ModalBody>
            <form onSubmit={submit}>
              <FormControl>
                <Input
                  required
                  type="number"
                  name="tokenId"
                  placeholder="Token ID"
                ></Input>
              </FormControl>
              <FormControl>
                <Input
                  required
                  type="number"
                  name="amount"
                  placeholder="Amount"
                />
              </FormControl>
              <Button type="submit">Unstake</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function Header({ links = [] }) {
  const history = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connect, disconnect, activeAccount, connected } = useWallet();
  const { colorMode, toggleColorMode } = useColorMode();

  const whiteListProposer = async (e) => {
	 e.preventDefault();
    const { userId } = e.target.elements;
    const contract = await wallet.at(CONTRACT_ADDRESS);
	console.log("UserId: ",userId.value);
    const addMember = await contract.methods.addDaoMembers(userId.value).send();
	await addMember.confirmation(1);
	alert('New Member Added');
	
  };

  return (
    <Box
      color={useColorModeValue('blue', 'dark blue')}
      bg={useColorModeValue('cyan.100', 'cyan.900')}
      px={4}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing={8} alignItems={'center'}>
          <Box></Box>
        </HStack>
        <Text fontSize="3xl" colorScheme="blue" fontWeight="bold">
          TezDAO
        </Text>

        <Flex alignItems={'center'}>
          <IconButton
            marginRight="10px"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          />
          <Box display={{ base: 'none', md: 'flex' }}>
            {!connected ? (
              <Button onClick={connect}>Connect Wallet</Button>
            ) : (
              <Menu>
                <MenuButton as={Button} cursor={'pointer'} minW={0}>
                  <Text
                    maxW="300px"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    {activeAccount?.address}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => history('/mypreds')}>
                    Predictions
                  </MenuItem>
                  <MenuItem onClick={() => history('/multisig')}>
                    MultiSig
                  </MenuItem>
                  <MenuItem onClick={onOpen}>Register Me</MenuItem>
						<Modal isOpen={isOpen} onClose={onClose}>
						    <ModalOverlay />
						    <ModalContent>
							    <ModalHeader>Register Me</ModalHeader>
							    <ModalBody>
									<form onSubmit={whiteListProposer}>
										<FormControl>
											<Input
												required
												type="string"
												name="userId"
												placeholder="User Id"
											></Input>
										</FormControl>
										<Button type="submit">Register</Button>
									</form>
								</ModalBody>
							</ModalContent>
						</Modal>
                  <MenuItem onClick={disconnect}>Disconnect</MenuItem>
                  <Redeem />
                </MenuList>
              </Menu>
            )}
          </Box>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {!connected ? (
              <Button onClick={connect}>Connect Wallet</Button>
            ) : (
              <Menu>
                <MenuButton as={Button} cursor={'pointer'} minW={0}>
                  <Text
                    maxW="300px"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    {activeAccount?.address}
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => history('/mypreds')}>
                    Predictions
                  </MenuItem>
				  <MenuItem onClick={() => history('/multisig')}>
                    MultiSig
                  </MenuItem>
                  <MenuItem onClick={disconnect}>Disconnect</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
