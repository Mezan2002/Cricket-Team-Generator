import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCricket } from "@/context/CricketContext";
import { AlertCircle, Users } from "lucide-react";
import React from "react";
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd";
import PlayerCard from "./PlayerCard";

interface PlayersListProps {
  showDragHandle?: boolean;
}

const PlayersList: React.FC<PlayersListProps> = ({ showDragHandle = true }) => {
  const { allPlayers, removePlayer } = useCricket();

  if (allPlayers.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Player List</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
          <p>No players added yet. Use the form above to add players.</p>
        </CardContent>
      </Card>
    );
  }

  if (!showDragHandle) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Player List ({allPlayers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="player-list">
            {allPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onRemove={removePlayer}
                isDraggable={false}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Player Pool ({allPlayers.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="all-players">
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="player-list"
            >
              {allPlayers.map((player, index) => (
                <Draggable
                  key={player.id}
                  draggableId={player.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        snapshot.isDragging ? "dragging" : ""
                      } transition-transform duration-200`}
                    >
                      <PlayerCard
                        player={player}
                        onRemove={removePlayer}
                        isDraggable={true}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

export default PlayersList;
