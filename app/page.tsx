import Translator from "@/components/Translator";
import { PrimeReactProvider } from 'primereact/api';


export default function Home() {

  return (
    <div>
      <PrimeReactProvider>
        <Translator />
      </PrimeReactProvider>
    </div>
  )

}