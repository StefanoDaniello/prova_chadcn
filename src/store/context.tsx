import React, { createContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";

export interface Campi {
  id: number;
  Name: string;
  isOccupated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prenotazioni {
  Data: string;
  Start_Time: string;
  End_Time: string;
  campo_id: number;
}
interface ContextType {
  campi: Campi[];
  prenotazioni: Prenotazioni[];
  valueSelect: string;
  setValueSelect: React.Dispatch<React.SetStateAction<string>>;
  campoValue: string;
  setCampoValue: React.Dispatch<React.SetStateAction<string>>;
  prenotazioniCampo1: Prenotazioni[];
  setPrenotazioniCampo1: React.Dispatch<React.SetStateAction<Prenotazioni[]>>;
}

const Context = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [campi, setCampi] = useState<Campi[]>([]);
  const [prenotazioni, setPrenotazioni] = useState<Prenotazioni[]>([]);
  const [prenotazioniCampo1, setPrenotazioniCampo1] = useState<Prenotazioni[]>(
    []
  );
  //   const [loading, setLoading] = useState<boolean>(false);
  const [valueSelect, setValueSelect] = React.useState("");
  const [campoValue, setCampoValue] = React.useState("");

  const fetchCampi = async () => {
    try {
      const response = await axios.get("http://localhost:80/api/campi");
      if (response.data.status === "success") {
        setCampi(response.data.results);
        console.log("campi", response.data.results);
      }
    } catch (error) {
      console.error("Errore operazione:", error);
    }
  };
  const fetchPrenotazioni = async () => {
    try {
      const response = await axios.get("http://localhost:80/api/prenotazioni");
      if (response.data.status === "success") {
        setPrenotazioni(response.data.results);
        setPrenotazioniCampo1(response.data.results);
        console.log("prenotazioni", response.data.results);
      }
    } catch (error) {
      console.error("Errore operazione:", error);
    }
  };
  useEffect(() => {
    fetchCampi();
    fetchPrenotazioni();
  }, []);

  const value = {
    campi,
    prenotazioni,
    valueSelect,
    setValueSelect,
    campoValue,
    setCampoValue,
    prenotazioniCampo1,
    setPrenotazioniCampo1,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Context;
