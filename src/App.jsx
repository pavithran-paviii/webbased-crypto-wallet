import { useState } from "react";
import classNames from "./app.module.scss";

//pages
import Onboard from "./pages/onboard";
import Wallet from "./pages/wallet";

function App() {
  const [allAccounts, setAllAccounts] = useState(() => {
    const storedWallets = localStorage.getItem("wallets");
    return storedWallets ? JSON.parse(storedWallets) : [];
  });

  return (
    <div className={classNames.mainLayout}>
      {allAccounts?.length > 0 ? (
        <Wallet allAccounts={allAccounts} setAllAccounts={setAllAccounts} />
      ) : (
        <Onboard allAccounts={allAccounts} setAllAccounts={setAllAccounts} />
      )}
    </div>
  );
}

export default App;
