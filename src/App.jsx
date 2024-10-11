import classNames from "./app.module.scss";

//pages
import Onboard from "./pages/onboard";

function App() {
  return (
    <div className={classNames.mainLayout}>
      <Onboard />
    </div>
  );
}

export default App;
