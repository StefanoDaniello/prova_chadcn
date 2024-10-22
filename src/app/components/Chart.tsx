"use client";
import { useContextApp } from "@/store/useAppContext";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader } from "@/components/ui/card";
import { Popover } from "./Popover";
import { useEffect } from "react";

// Funzione per mappare il numero del mese a una stringa di mese
const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "long" });
};

// Funzione per ottenere il nome del giorno
const getDayName = (dayIndex: number) => {
  const days = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ];
  return days[dayIndex];
};

export function Chart() {
  const {
    prenotazioni,
    valueSelect,
    campoValue,
    prenotazioniCampo1,
    setPrenotazioniCampo1,
    campi,
  } = useContextApp();

  useEffect(() => {
    const campoID = campi.find((campo) => campo.Name === campoValue)?.id;
    if (campoValue !== "Tutti") {
      const prenotazioniCampo = prenotazioni.filter(
        (prenotazione) => prenotazione.campo_id === campoID
      );

      setPrenotazioniCampo1(prenotazioniCampo);
    } else {
      setPrenotazioniCampo1(prenotazioni);
    }
    console.log("PrenotazioniProvola:", prenotazioni);
    console.log("Campo IDprovola:", campoID);
    console.log("Prenotazioni Campo provola:", prenotazioniCampo1);
  }, [campoValue, prenotazioni]);

  let chartData: any[] = [];

  // Funzione per raggruppare le prenotazioni per anno, mese o settimana
  const groupData = () => {
    const today = new Date();

    if (valueSelect === "Anno") {
      const year = today.getFullYear();
      chartData = Array(12)
        .fill(0)
        .map((_, i) => ({
          month: getMonthName(i + 1),
          prenotazioni: 0,
        }));

      prenotazioniCampo1.forEach((prenotazione) => {
        const prenotazioneDate = new Date(prenotazione.Data);
        if (prenotazioneDate.getFullYear() === year) {
          const monthIndex = prenotazioneDate.getMonth(); // 0-11
          chartData[monthIndex].prenotazioni += 1;
        }
      });
    } else if (valueSelect === "Mese") {
      const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      chartData = Array(daysInMonth)
        .fill(0)
        .map((_, i) => ({
          day: i + 1, // Giorni del mese
          prenotazioni: 0,
        }));

      prenotazioniCampo1.forEach((prenotazione) => {
        const prenotazioneDate = new Date(prenotazione.Data);
        if (
          prenotazioneDate.getMonth() === today.getMonth() &&
          prenotazioneDate.getFullYear() === today.getFullYear()
        ) {
          const dayIndex = prenotazioneDate.getDate() - 1; // 0-29 (es: 1 diventa 0)
          chartData[dayIndex].prenotazioni += 1;
        }
      });
    } else if (valueSelect === "Settimana") {
      const dayOfWeek = today.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
      const startOfWeek = new Date(today); // Creiamo una nuova data

      startOfWeek.setDate(today.getDate() - dayOfWeek); // Imposta la data di inizio della settimana

      // Crea un array per i dati della settimana
      chartData = Array(7)
        .fill(0)
        .map((_, i) => ({
          day: getDayName(i), // Nomi dei giorni della settimana
          prenotazioni: 0,
        }));

      prenotazioniCampo1.forEach((prenotazione) => {
        const prenotazioneDate = new Date(prenotazione.Data);
        console.log("Controllo prenotazione per:", prenotazioneDate); // Debug della prenotazione

        // Verifica se la prenotazione è nella settimana corrente
        if (
          prenotazioneDate >= startOfWeek &&
          prenotazioneDate <
            new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        ) {
          // Calcola l'indice da Lunedì a Domenica
          const dayIndex = (prenotazioneDate.getDay() + 6) % 7; // 0 = Domenica diventa 6, 1 = Lunedì diventa 0, etc.
          chartData[dayIndex].prenotazioni += 1; // Incrementa la prenotazione della giornata
        }
      });

      console.log("Dati del grafico:", chartData); // Verifica i dati raccolti
    }
  };

  // Chiama la funzione per raggruppare i dati in base alla selezione
  groupData();
  console.log("Chart Data:", chartData);

  const chartConfig = {
    prenotazioni: {
      label: "Prenotazioni",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center pt-2 pb-8">
        <CardHeader className="p-0 font-semibold text-xl">
          Prenotazioni {valueSelect}
        </CardHeader>
        <div className="flex items-center gap-3 ">
          <Popover action="tempo" />
          <Popover action="campi" />
        </div>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[200px] w-full ">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={
              valueSelect === "Mese"
                ? "day"
                : valueSelect === "Settimana"
                ? "day"
                : "month"
            }
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => {
              return typeof value === "string" ? value.slice(0, 3) : value;
            }} // Mostra solo le prime 3 lettere del mese
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="prenotazioni"
            fill="var(--color-prenotazioni)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
