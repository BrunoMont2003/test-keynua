import { ContractProvider } from './context/ContractContext';
import { ContractFormPage } from './components/pages/ContractFormPage';

function App() {
  return (
    <ContractProvider>
      <ContractFormPage />
    </ContractProvider>
  );
}

export default App;

