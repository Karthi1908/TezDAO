import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, MichelCodecPacker } from '@taquito/taquito';
//const CONTRACT_ADDRESS = 'KT1MtcQgY6nQpjdWXuRaYdbLZxq4o5pzB3z5';

const CONTRACT_ADDRESS = 'KT1D5pLaR6Gwqtdyf4oTQwtzYqnksHTboiT9';
const TOKEN_ADDRESS = 'KT1KCGqRm7wnHcFDJuwqLTNSsjksgHd2aD19'

const Tezos = new TezosToolkit('https://hangzhounet.smartpy.io');
Tezos.setPackerProvider(new MichelCodecPacker());

const ContractProvider = Tezos.contract;

const beaconWallet = new BeaconWallet({
  name: 'TezDAO',
  preferredNetwork: "hangzhounet"
});

Tezos.setWalletProvider(beaconWallet);

const wallet = Tezos.wallet;

export { CONTRACT_ADDRESS, TOKEN_ADDRESS, Tezos, ContractProvider, wallet, beaconWallet };
