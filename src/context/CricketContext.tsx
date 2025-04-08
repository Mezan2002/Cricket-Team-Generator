import React, { createContext, ReactNode, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AppStep, CaptainTossChoice, Player, Team, TossResult } from "../types";

interface CricketContextType {
  step: AppStep;
  setStep: (step: AppStep) => void;
  allPlayers: Player[];
  teamAlpha: Team;
  teamBeta: Team;
  addPlayer: (player: Omit<Player, "id">) => void;
  removePlayer: (playerId: string) => void;
  movePlayerToTeam: (playerId: string, teamId: string) => void;
  selectCaptain: (playerId: string, teamId: string) => void;
  tossResult: TossResult;
  performToss: () => void;
  tossWinningTeam: Team | null;
  resetToStep: (step: AppStep) => void;
  isTeamFormationComplete: boolean;
  setIsTeamFormationComplete: (value: boolean) => void;
  captainChoice: CaptainTossChoice | null;
  setCaptainChoice: (choice: CaptainTossChoice) => void;
}

const defaultPlayers = [
  {
    id: "01",
    name: "Imtiaz",
    imageUrl: "/images/Imtiaz.jpeg",
    weight: 3,
  },
  {
    id: "02",
    name: "Mizan",
    imageUrl: "/images/cricket-player.png",
    weight: 3,
  },
  {
    id: "03",
    name: "Tahsin",
    imageUrl: "/images/Tahsin.jpeg",
    weight: 3,
  },
  {
    id: "04",
    name: "Momenul",
    imageUrl: "/images/Momenul.jpeg",
    weight: 3,
  },
  {
    id: "05",
    name: "Mezan",
    imageUrl: "/images/Mezan.jpeg",
    weight: 5,
  },
  {
    id: "06",
    name: "Mahabub",
    imageUrl: "/images/Mahabub.jpeg",
    weight: 2,
  },
  {
    id: "07",
    name: "Zabid",
    imageUrl: "/images/Zabid.jpeg",
    weight: 4,
  },
  {
    id: "08",
    name: "Rashed",
    imageUrl: "/images/Rashed.jpeg",
    weight: 3,
  },
  {
    id: "09",
    name: "Akbar",
    imageUrl: "/images/Akbar.jpeg",
    weight: 2,
  },
  {
    id: "10",
    name: "Shamil",
    imageUrl: "/images/Shamil.jpeg",
    weight: 1,
  },
  {
    id: "11",
    name: "Elias",
    imageUrl: "/images/Elias.jpeg",
    weight: 5,
  },
  {
    id: "12",
    name: "Emran",
    imageUrl: "/images/Emran.jpeg",
    weight: 1,
  },
  {
    id: "13",
    name: "Saqib",
    imageUrl: "/images/Saqib.jpeg",
    weight: 2,
  },
  {
    id: "14",
    name: "Rakib",
    imageUrl: "/images/Rakib.jpeg",
    weight: 5,
  },
  {
    id: "15",
    name: "Arif",
    imageUrl: "/images/cricket-player.png",
    weight: 3,
  },
  {
    id: "16",
    name: "Riaz",
    imageUrl: "/images/Riaz.jpeg",
    weight: 4,
  },
  {
    id: "17",
    name: "Kamruzzaman",
    imageUrl: "/images/Kamruzzaman.jpeg",
    weight: 5,
  },
  {
    id: "18",
    name: "Shahnewaz",
    imageUrl: "/images/Shahnewaz.jpeg",
    weight: 3,
  },
  {
    id: "19",
    name: "Maruf",
    imageUrl: "/images/Maruf.jpeg",
    weight: 1,
  },
  {
    id: "20",
    name: "Rifat",
    imageUrl: "/images/Rifat.jpeg",
    weight: 1,
  },
];

const CricketContext = createContext<CricketContextType | undefined>(undefined);

export const CricketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<AppStep>(AppStep.ADD_PLAYERS);
  const [allPlayers, setAllPlayers] = useState<Player[]>(defaultPlayers);
  const [teamAlpha, setTeamAlpha] = useState<Team>({
    id: "team-alpha",
    name: "Team Alpha",
    players: [],
  });
  const [teamBeta, setTeamBeta] = useState<Team>({
    id: "team-beta",
    name: "Team Beta",
    players: [],
  });
  const [tossResult, setTossResult] = useState<TossResult>(null);
  const [tossWinningTeam, setTossWinningTeam] = useState<Team | null>(null);
  const [isTeamFormationComplete, setIsTeamFormationComplete] = useState(false);
  const [captainChoice, setCaptainChoice] = useState<CaptainTossChoice | null>(
    null
  );

  const addPlayer = (player: Omit<Player, "id">) => {
    const newPlayer = {
      ...player,
      id: uuidv4(),
    };
    setAllPlayers((prev) => [...prev, newPlayer]);
  };

  const removePlayer = (playerId: string) => {
    setAllPlayers((prev) => prev.filter((player) => player.id !== playerId));

    setTeamAlpha((prev) => ({
      ...prev,
      players: prev.players.filter((player) => player.id !== playerId),
    }));

    setTeamBeta((prev) => ({
      ...prev,
      players: prev.players.filter((player) => player.id !== playerId),
    }));
  };

  const movePlayerToTeam = (playerId: string, teamId: string) => {
    const player = [
      ...allPlayers,
      ...teamAlpha.players,
      ...teamBeta.players,
    ].find((p) => p.id === playerId);

    if (!player) return;

    const updatedAllPlayers = allPlayers.filter((p) => p.id !== playerId);
    const updatedTeamAlpha = {
      ...teamAlpha,
      players: teamAlpha.players.filter((p) => p.id !== playerId),
    };
    const updatedTeamBeta = {
      ...teamBeta,
      players: teamBeta.players.filter((p) => p.id !== playerId),
    };

    if (teamId === "team-alpha") {
      updatedTeamAlpha.players.push(player);
    } else if (teamId === "team-beta") {
      updatedTeamBeta.players.push(player);
    } else if (teamId === "all-players") {
      updatedAllPlayers.push(player);
    }

    setAllPlayers(updatedAllPlayers);
    setTeamAlpha(updatedTeamAlpha);
    setTeamBeta(updatedTeamBeta);
  };

  const selectCaptain = (playerId: string, teamId: string) => {
    if (teamId === "team-alpha") {
      const newTeam = { ...teamAlpha };

      newTeam.players = newTeam.players.map((player) => ({
        ...player,
        isCaptain: player.id === playerId,
      }));

      newTeam.captain = newTeam.players.find((p) => p.id === playerId);

      setTeamAlpha(newTeam);
    } else if (teamId === "team-beta") {
      const newTeam = { ...teamBeta };

      newTeam.players = newTeam.players.map((player) => ({
        ...player,
        isCaptain: player.id === playerId,
      }));

      newTeam.captain = newTeam.players.find((p) => p.id === playerId);

      setTeamBeta(newTeam);
    }
  };

  const performToss = () => {
    const result: TossResult = Math.random() > 0.5 ? "heads" : "tails";
    setTossResult(result);

    if (captainChoice) {
      const callingTeamId = captainChoice.teamId;
      const callingChoice = captainChoice.choice;

      const winningTeamId =
        callingChoice === result
          ? callingTeamId
          : callingTeamId === "team-alpha"
          ? "team-beta"
          : "team-alpha";

      const winningTeam = winningTeamId === "team-alpha" ? teamAlpha : teamBeta;
      setTossWinningTeam(winningTeam);
    }
  };

  const resetToStep = (targetStep: AppStep) => {
    if (targetStep === AppStep.ADD_PLAYERS) {
      setAllPlayers(defaultPlayers);
      setTeamAlpha({
        id: "team-alpha",
        name: "Team Alpha",
        players: [],
      });
      setTeamBeta({
        id: "team-beta",
        name: "Team Beta",
        players: [],
      });
      setTossResult(null);
      setTossWinningTeam(null);
      setIsTeamFormationComplete(false);
      setCaptainChoice(null);
    } else if (targetStep === AppStep.FORM_TEAMS) {
      const allTeamPlayers = [...teamAlpha.players, ...teamBeta.players];
      setAllPlayers((prev) => [...prev, ...allTeamPlayers]);
      setTeamAlpha({
        ...teamAlpha,
        players: [],
        captain: undefined,
      });
      setTeamBeta({
        ...teamBeta,
        players: [],
        captain: undefined,
      });
      setTossResult(null);
      setTossWinningTeam(null);
      setIsTeamFormationComplete(false);
      setCaptainChoice(null);
    } else if (targetStep === AppStep.SELECT_CAPTAINS) {
      setTeamAlpha({
        ...teamAlpha,
        players: teamAlpha.players.map((p) => ({ ...p, isCaptain: false })),
        captain: undefined,
      });
      setTeamBeta({
        ...teamBeta,
        players: teamBeta.players.map((p) => ({ ...p, isCaptain: false })),
        captain: undefined,
      });
      setTossResult(null);
      setTossWinningTeam(null);
      setCaptainChoice(null);
    } else if (targetStep === AppStep.TOSS) {
      setTossResult(null);
      setTossWinningTeam(null);
      setCaptainChoice(null);
    }

    setStep(targetStep);
  };

  return (
    <CricketContext.Provider
      value={{
        step,
        setStep,
        allPlayers,
        teamAlpha,
        teamBeta,
        addPlayer,
        removePlayer,
        movePlayerToTeam,
        selectCaptain,
        tossResult,
        performToss,
        tossWinningTeam,
        resetToStep,
        isTeamFormationComplete,
        setIsTeamFormationComplete,
        captainChoice,
        setCaptainChoice,
      }}
    >
      {children}
    </CricketContext.Provider>
  );
};

export const useCricket = (): CricketContextType => {
  const context = useContext(CricketContext);
  if (context === undefined) {
    throw new Error("useCricket must be used within a CricketProvider");
  }
  return context;
};
