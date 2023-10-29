import { BoundingBoxProvider } from "./components/BoundingBox";
import Layout from "./components/layout/Layout";
import SolvingPage from "./containers/SolvingPage";

function App() {
  return (
    <Layout>
        <BoundingBoxProvider>
          <SolvingPage />
        </BoundingBoxProvider>
    </Layout>
  );
}

export default App;
