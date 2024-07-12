import { CheckCircle, CircleDashed, UserCog } from "lucide-react";
import Button from "../../components/button";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  isConfirmed: boolean;
}

const Guests = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const { tripId } = useParams();

  useEffect(() => {
    api
      .get(`trips/${tripId}/participants`)
      .then((response) => setParticipants(response.data.participants));
  }, [tripId]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => (
          <div className="flex items-center justify-between gap-4">
            <div key={participant.id} className="space-y-1.5">
              <span className="block font-medium text-zinc-100">
                {participant.name ?? `Convidado ${index}`}
              </span>
              <span className="block text-sm text-zinc-400 truncate">
                {participant.email}
              </span>
            </div>

            {participant.isConfirmed ? (
              <CheckCircle className="text-lime-500 size-5 shrink-0" />
            ) : (
              <CircleDashed className="text-zinc-400 size-5 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Button variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
    </div>
  );
};

export default Guests;
