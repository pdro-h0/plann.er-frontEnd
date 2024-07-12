import { CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  date: string;
  activities: {
    id: string;
    title: string;
    occursAt: string;
  }[];
}

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const { tripId } = useParams();

  useEffect(() => {
    api
      .get(`trips/${tripId}/activities`)
      .then((response) => setActivities(response.data.activities));
  }, [tripId]);

  return (
    <div className="space-y-8">
      {activities.map((activityItem) => (
        <div key={activityItem.date} className="space-y-2.5">
          <div className="flex gap-2 items-baseline">
            <span className="text-xl text-zinc-300 font-semibold">
              Dia {format(activityItem.date, "d")}
            </span>
            <span className="text-xs text-zinc-500">
              {format(activityItem.date, "EEEE", { locale: ptBR })}
            </span>
          </div>

          {activityItem.activities.length > 0 ? (
            <div className="space-y-2.5">
              {activityItem.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3"
                >
                  <CircleCheck className="size-5 text-lime-300" />
                  <span className="text-zinc-100">{activity.title}</span>
                  <span className="text-zinc-400 text-sm ml-auto">
                    {format(activity.occursAt, "HH:mm")}h
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">
              Nenhuma atividade cadastrada nessa data.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Activities;
