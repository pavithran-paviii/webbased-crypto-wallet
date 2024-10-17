import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function generateNewWallet(
  currentAccount,
  mnemonic,
  allAccounts,
  setAllAccounts
) {
  const seedFromPhase = mnemonicToSeedSync(mnemonic);
  const derivedPath = `m/44'/501'/${currentAccount}'/0'`;
  const derivedSeed = derivePath(derivedPath, seedFromPhase.toString("hex"));
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed.key).secretKey;
  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
  const secretBase58 = bs58.encode(secret);
  let newWallet = {
    publicKey: publicKey,
    privateKey: secretBase58,
    name: `Wallet ${currentAccount + 1}`,
  };
  setAllAccounts((prev) => {
    return [...prev, newWallet];
  });
  localStorage.setItem("wallets", JSON.stringify([...allAccounts, newWallet]));
}
