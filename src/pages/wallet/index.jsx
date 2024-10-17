import React, { useState } from "react";
import classNames from "./wallet.module.scss";

//assets
import solana from "../../assets/images/networks/solana.png";
import {
  IoIosArrowDown,
  IoMdAdd,
  IoMdArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { RxCopy } from "react-icons/rx";
import {
  IoArrowDown,
  IoArrowUp,
  IoSwapHorizontalSharp,
  IoClose,
  IoKeySharp,
} from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { generateNewWallet } from "../../assets/functions";

const Wallet = ({ allAccounts, setAllAccounts }) => {
  const [selectedWallet, setSelectedWallet] = useState("");
  const [allAccountsDashboard, setAllAccountsDashboard] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const currentWallet = selectedWallet ? selectedWallet : allAccounts[0];

  return (
    <div className={classNames.wallet}>
      <div className={classNames.walletTab}>
        <div>
          <img src={solana} alt="solana" />
        </div>
        <div
          className={classNames.dropdownBtn}
          onClick={() => setAllAccountsDashboard({ type: "allAccounts" })}
        >
          <span>{currentWallet?.name}</span>
          <IoIosArrowDown />
        </div>
        <div
          onClick={() => {
            navigator.clipboard.writeText(currentWallet?.publicKey);
            let walletCopyBtn = document.getElementById("walletCopied");
            walletCopyBtn.style.display = "block";
            setTimeout(() => {
              walletCopyBtn.style.display = "none";
            }, 3000);
          }}
        >
          <RxCopy />
          <div className={classNames.walletCopiedText} id="walletCopied">
            {currentWallet?.publicKey?.slice(0, 3) +
              "..." +
              currentWallet?.publicKey?.slice(41, 43)}
          </div>
        </div>
      </div>
      <div className={classNames.dashboard}>
        <div className={classNames.totalValue}>$0.00</div>
        <div className={classNames.todayChange}>
          <span>$0.00</span>
          <span>0%</span>
        </div>
        <div className={classNames.allBtns}>
          <div>
            <div className={classNames.iconDiv}>
              <IoArrowDown />
            </div>
            <div className={classNames.type}>Receive</div>
          </div>
          <div>
            <div className={classNames.iconDiv}>
              <IoArrowUp />
            </div>
            <div className={classNames.type}>Send</div>
          </div>
          <div>
            <div className={classNames.iconDiv}>
              <IoSwapHorizontalSharp />
            </div>
            <div className={classNames.type}>Swap</div>
          </div>
        </div>
      </div>
      <div
        className={`${classNames.allAccounts} ${
          allAccountsDashboard?.type === "allAccounts" &&
          classNames.isAllAccountsActive
        }`}
      >
        <div className={classNames.header}>
          <span> Wallets</span>
          <IoClose onClick={() => setAllAccountsDashboard(false)} />
        </div>
        <div className={classNames.allWallets}>
          {Array.isArray(allAccounts) &&
            allAccounts?.length > 0 &&
            allAccounts?.map((eachAccount, index) => {
              return (
                <div
                  className={classNames.eachWallet}
                  key={eachAccount?.publicKey + index}
                >
                  <div
                    className={classNames.details}
                    onClick={() => {
                      setSelectedWallet(eachAccount);
                      setAllAccountsDashboard(false);
                    }}
                  >
                    <img src={solana} alt="solana" />
                    <div className={classNames.accountDetails}>
                      <div className={classNames.name}>{eachAccount.name}</div>
                      <div className={classNames.publicKey}>
                        <IoKeySharp />
                        {eachAccount?.publicKey?.slice(0, 4) +
                          "..." +
                          eachAccount?.publicKey?.slice(39, 43)}
                      </div>
                    </div>
                  </div>
                  <div className={classNames.controls}>
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(eachAccount?.publicKey);
                        setCopiedText(eachAccount?.publicKey);
                        setTimeout(() => {
                          setCopiedText(false);
                        }, 1500);
                      }}
                    >
                      {copiedText === eachAccount?.publicKey ? (
                        <TiTick style={{ color: "green" }} />
                      ) : (
                        <RxCopy />
                      )}
                    </div>
                    <BsThreeDotsVertical
                      onClick={() => {
                        setSelectedWallet(eachAccount);
                        setAllAccountsDashboard({
                          type: "singleAccount",
                          account: eachAccount,
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div
          className={classNames.addNewWallet}
          onClick={() =>
            generateNewWallet(
              allAccounts?.length,
              localStorage.getItem("generatedmnemonic"),
              allAccounts,
              setAllAccounts
            )
          }
        >
          <IoMdAdd />
          <span>Add new Solana wallet</span>
        </div>
      </div>
      <div
        className={`${classNames.allAccounts} ${
          classNames.eachAccountSettings
        } ${
          allAccountsDashboard?.type?.includes("singleAccount") &&
          classNames.isSingleAccountsActive
        }`}
      >
        <div className={classNames.header}>
          <span>
            {allAccountsDashboard?.type?.includes("singleAccountPrivateKey")
              ? "Private Key"
              : selectedWallet.name}
          </span>
          {!allAccountsDashboard?.type?.includes("singleAccountPrivateKey") && (
            <IoMdArrowBack
              style={{ opacity: "0.6" }}
              onClick={() => setAllAccountsDashboard({ type: "allAccounts" })}
            />
          )}
        </div>
        {allAccountsDashboard?.type?.includes("singleAccountPrivateKey") ? (
          <div className={classNames.showPrivateKey}>
            <FaEye />
            <div className={classNames.title}>Your Private Key</div>
            <div className={classNames.warning}>
              Never give out your private key to anyone.
            </div>
            <div className={classNames.privateKey}>
              {selectedWallet?.privateKey}
            </div>
            <div className={classNames.btnsContainer}>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(selectedWallet?.privateKey);
                  setCopiedText(selectedWallet?.privateKey);
                  setTimeout(() => {
                    setCopiedText(false);
                  }, 1500);
                }}
              >
                {copiedText === selectedWallet?.privateKey ? (
                  <>
                    <span>Copied</span>
                    <TiTick style={{ color: "green" }} />
                  </>
                ) : (
                  <>
                    <span>Copy</span>
                    <RxCopy />
                  </>
                )}
              </div>
              <div
                onClick={() =>
                  setAllAccountsDashboard({
                    type: "singleAccount",
                    account: selectedWallet,
                  })
                }
              >
                Close
              </div>
            </div>
          </div>
        ) : (
          <div className={classNames.allOptions}>
            <div
              className={classNames.eachOption}
              onClick={() => {
                setAllAccountsDashboard({
                  type: "singleAccountPrivateKey",
                  account: selectedWallet,
                });
              }}
            >
              <span>Show Private Key</span>
              <IoIosArrowForward />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
