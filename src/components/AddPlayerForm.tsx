import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCricket } from "@/context/CricketContext";
import { AppStep } from "@/types";
import { ChevronsRight, Plus, UserPlus } from "lucide-react";
import React, { useState } from "react";

const AddPlayerForm: React.FC = () => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weight, setWeight] = useState("");
  const { addPlayer, allPlayers, setStep } = useCricket();
  const { toast } = useToast();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Player name is required",
        variant: "destructive",
      });
      return;
    }

    // Default image if not provided
    const finalImageUrl =
      imageUrl.trim() ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`;

    // Validate weight
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }

    addPlayer({
      name: name.trim(),
      imageUrl: finalImageUrl,
      weight: weightNum,
    });

    // Reset form
    setName("");
    setImageUrl("");
    setWeight("");

    toast({
      title: "Player Added",
      description: `${name} has been added to the player pool`,
    });
  };

  const handleProceedToTeams = () => {
    if (allPlayers.length < 2) {
      toast({
        title: "Not Enough Players",
        description: "You need at least 2 players to form teams",
        variant: "destructive",
      });
      return;
    }
    setStep(AppStep.FORM_TEAMS);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          <span>Add New Player</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddPlayer} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL (or leave empty for default)"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for auto-generated avatar
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight *</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter player weight"
              className="w-full"
              min="1"
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Player</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full gap-2 mt-4"
          onClick={handleProceedToTeams}
          disabled={allPlayers.length < 2}
        >
          <span>Proceed to Form Teams</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddPlayerForm;
