import AddPlayerForm from "@/components/AddPlayerForm";
import CaptainSelection from "@/components/CaptainSelection";
import CoinToss from "@/components/CoinToss";
import PlayersList from "@/components/PlayersList";
import StepIndicator from "@/components/StepIndicator";
import TeamFormation from "@/components/TeamFormation";
import TeamResult from "@/components/TeamResult";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CricketProvider, useCricket } from "@/context/CricketContext";
import { AppStep } from "@/types";
import { CircleOff } from "lucide-react";
import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

// Add Montserrat font
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";

const CricketTeamSelector: React.FC = () => {
  const { step, movePlayerToTeam, resetToStep } = useCricket();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Move the player to the appropriate team
    movePlayerToTeam(draggableId, destination.droppableId);
  };

  const renderStepContent = () => {
    switch (step) {
      case AppStep.ADD_PLAYERS:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <AddPlayerForm />
            </div>
            <div>
              <PlayersList showDragHandle={false} />
            </div>
          </div>
        );
      case AppStep.FORM_TEAMS:
        return <TeamFormation />;
      case AppStep.SELECT_CAPTAINS:
        return <CaptainSelection />;
      case AppStep.TOSS:
        return <CoinToss />;
      case AppStep.RESULT:
        return (
          <div className="space-y-8">
            <TeamResult />
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => resetToStep(AppStep.ADD_PLAYERS)}
                className="gap-2"
              >
                Start New Game
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Wrap with DragDropContext when drag and drop is needed
  const content = renderStepContent();
  const shouldEnableDragDrop =
    step === AppStep.FORM_TEAMS || step === AppStep.ADD_PLAYERS;

  return (
    <div className="container mx-auto px-4 py-8 font-montserrat">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CircleOff className="h-8 w-8" />
            <span>Cricket Team Selector Pro</span>
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <StepIndicator />

      <main>
        {shouldEnableDragDrop ? (
          <DragDropContext onDragEnd={handleDragEnd}>{content}</DragDropContext>
        ) : (
          content
        )}
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <CricketProvider>
      <CricketTeamSelector />
    </CricketProvider>
  );
};

export default Index;
