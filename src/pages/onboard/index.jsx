import React, { useState } from "react";
import classNames from "./onboard.module.scss";
import { generateMnemonic } from "bip39";

//assets
import logo from "../../assets/images/logo.png";
import { allNetworks } from "../../assets/constants";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { IoMdLock, IoMdArrowBack } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { generateNewWallet } from "../../assets/functions";

const Onboard = ({ allAccounts, setAllAccounts }) => {
  const [currentStep, setCurrentStep] = useState(1); // default 1
  const [searchQuery, setSearchQuery] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [mnemonic, setMnemonic] = useState(
    "" || localStorage.getItem("generatedmnemonic")
  );
  const [password, setPassword] = useState(
    {} || localStorage.getItem("walletLocalPassword")
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={classNames.onboard}>
      {currentStep === 6 && allAccounts?.length > 0 ? (
        "Wallet mnemonic generated!"
      ) : currentStep === 5 ? (
        <>
          <div className={classNames.details}>
            <div
              className={classNames.backBtn}
              onClick={() => {
                setCurrentStep(4);
                setCheckboxChecked(false);
              }}
            >
              <IoMdArrowBack />
              <span>Go back</span>
            </div>
            <h1>Create a Password</h1>
            <div>
              <h4>It should be at least 8 characters.</h4>
              <h4>
                You’ll need this to unlock Backpack. Password Confirm Password
              </h4>
            </div>
            <div className={classNames.createPassword}>
              <div className={classNames.showPassword}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  className={classNames.inputContainer}
                  onChange={(event) =>
                    setPassword((prev) => {
                      return { ...prev, password: event?.target?.value };
                    })
                  }
                />
                <div onClick={() => setPasswordVisible((prev) => !prev)}>
                  {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                className={classNames.inputContainer}
                onChange={(event) =>
                  setPassword((prev) => {
                    return { ...prev, confirmpassword: event?.target?.value };
                  })
                }
              />
            </div>
            <div className={classNames.errorMessage} id="doNotMatch">
              Your passwords do not match.
            </div>
            <div className={classNames.errorMessage} id="lessThanEight">
              Your password must be at least 8 characters.
            </div>
            <div
              className={classNames.checkBoxContainer}
              style={{ marginTop: "5rem" }}
            >
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(event) => {
                  setCheckboxChecked(event.target.checked);

                  if (password?.password !== password?.confirmpassword) {
                    let displayWarning1 =
                      document.getElementById("lessThanEight");
                    let displayWarning2 = document.getElementById("doNotMatch");
                    displayWarning1.style.display = "none";
                    displayWarning2.style.display = "block";
                  } else if (
                    password?.password?.length < 8 ||
                    password?.confirmpassword?.length < 8
                  ) {
                    let displayWarning1 =
                      document.getElementById("lessThanEight");
                    let displayWarning2 = document.getElementById("doNotMatch");
                    displayWarning1.style.display = "block";
                    displayWarning2.style.display = "none";
                  } else {
                    let displayWarning1 =
                      document.getElementById("lessThanEight");
                    let displayWarning2 = document.getElementById("doNotMatch");
                    displayWarning1.style.display = "none";
                    displayWarning2.style.display = "none";
                  }
                }}
              />
              <span>
                I agree to the{" "}
                <span className={classNames.warningBtn}>Terms of Service</span>
              </span>
            </div>
            <button
              className={`${classNames.greyButton} ${
                (!checkboxChecked ||
                  password?.password?.length < 8 ||
                  password?.confirmpassword?.length < 8 ||
                  password?.password !== password?.confirmpassword) &&
                classNames.notAllowed
              }`}
              onClick={() => {
                localStorage.setItem(
                  "walletLocalPassword",
                  password?.confirmpassword
                );
                setCurrentStep(6);
                setCheckboxChecked(false);
                generateNewWallet(0, mnemonic, allAccounts, setAllAccounts);
              }}
            >
              Next
            </button>
          </div>
        </>
      ) : currentStep === 4 ? (
        <>
          <div className={classNames.details}>
            <div
              className={classNames.backBtn}
              onClick={() => {
                setCurrentStep(3);
                setCheckboxChecked(false);
              }}
            >
              <IoMdArrowBack />
              <span>Go back</span>
            </div>
            <h1>Secret Recovery Phrase</h1>
            <div>
              <h4>Save these words in a safe place.</h4>
              <h4
                className={classNames.warningBtn}
                onClick={() => {
                  setCurrentStep(3);
                  setCheckboxChecked(false);
                }}
              >
                Read the warnings again
              </h4>
            </div>
            <div
              className={classNames.mnemonic}
              onClick={() => {
                navigator.clipboard.writeText(mnemonic);
                let mnemonicCoptyBtn = document.getElementById("copyBtn");
                mnemonicCoptyBtn.innerText = "Copied!";
                setTimeout(() => {
                  mnemonicCoptyBtn.innerText =
                    "Click anywhere on this card to copy";
                }, 3000);
              }}
            >
              <ol className={classNames.container}>
                {Array.isArray(mnemonic?.split(" ")) &&
                  mnemonic?.split(" ")?.length > 0 &&
                  mnemonic?.split(" ")?.map((eachWord, index) => {
                    return <li key={eachWord + index}>{eachWord}</li>;
                  })}
              </ol>
              <div className={classNames.copyBtn} id="copyBtn">
                Click anywhere on this card to copy
              </div>
            </div>
            <div className={classNames.checkBoxContainer}>
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(event) => setCheckboxChecked(event.target.checked)}
              />
              <span>I saved my secret recovery phrase</span>
            </div>
            <button
              className={`${classNames.greyButton} ${
                !checkboxChecked && classNames.notAllowed
              }`}
              onClick={() => {
                setCurrentStep(5);
                setCheckboxChecked(false);
              }}
            >
              Next
            </button>
          </div>
        </>
      ) : currentStep === 3 ? (
        <>
          <div className={classNames.details}>
            <div
              className={classNames.backBtn}
              onClick={() => setCurrentStep(2)}
            >
              <IoMdArrowBack />
              <span>Go back</span>
            </div>
            <h1>Secret Recovery Phrase Warning</h1>
            <div>
              <h4>On the next page, you will receive your secret</h4>
              <h4>recovery phrase.</h4>
            </div>
            <div className={classNames.warnings}>
              <div className={classNames.eachWarning}>
                <TbAlertTriangleFilled className={classNames.colorYellow} />
                <div className={classNames.content}>
                  <div>
                    This is the <span>ONLY</span> way to recover your account
                  </div>
                  <div>if you lose access to your device or password.</div>
                </div>
              </div>
              <div className={classNames.eachWarning}>
                <IoMdLock className={classNames.colorGreen} />
                <div className={classNames.content}>
                  <div>Write it down, store it in a safe place, and</div>
                  <div>
                    <span>NEVER</span> share it with anyone.
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames.checkBoxContainer}>
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(event) => setCheckboxChecked(event.target.checked)}
              />
              <div>
                I understand that I am responsible for saving my secret recovery
                phrase, and that it is the only way to recover my wallet.
              </div>
            </div>
            <button
              className={`${classNames.greyButton} ${
                !checkboxChecked && classNames.notAllowed
              }`}
              onClick={() => {
                const generatedSeedPhrase = generateMnemonic();
                setCurrentStep(4);
                setCheckboxChecked(false);
                setMnemonic(generatedSeedPhrase);
                localStorage.setItem("generatedmnemonic", generatedSeedPhrase);
              }}
            >
              Next
            </button>
          </div>
        </>
      ) : currentStep === 2 ? (
        <>
          <div className={classNames.details}>
            <div
              className={classNames.backBtn}
              onClick={() => setCurrentStep(1)}
            >
              <IoMdArrowBack />
              <span>Go back</span>
            </div>
            <h1 className={classNames.title}>Select Network</h1>
            <div>
              <h4>Backpack supports multiple blockchains.</h4>
              <h4>
                Which do you want to use? You can add more later. Search
                Networks
              </h4>
            </div>
            <div className={classNames.searchContainer}>
              <input
                type="text"
                placeholder="Search Networks"
                className={classNames.inputContainer}
                onChange={(event) => setSearchQuery(event?.target?.value)}
              />
              <ul className={classNames.allNetworks}>
                {allNetworks
                  ?.filter((eachItem) =>
                    eachItem.name
                      ?.toLowerCase()
                      ?.includes(searchQuery?.toLowerCase())
                  )
                  ?.map((eachNetwork, index) => {
                    return (
                      <li
                        key={eachNetwork.name + index}
                        onClick={() => setCurrentStep(3)}
                      >
                        <img src={eachNetwork.logo} alt={eachNetwork.name} />
                        <span>{eachNetwork.name}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={classNames.details}>
            <img src={logo} alt="logo" />
            <h1>Welcome to Backpack</h1>
            <h4>Let's get started.</h4>
          </div>
          <div className={classNames.btnsComponent}>
            <button onClick={() => setCurrentStep(2)}>
              Create a new wallet
            </button>
            <button className={classNames.greyButton}>Import Wallet</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Onboard;
