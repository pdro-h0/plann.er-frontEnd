import { FormEvent, useState } from "react";
import InviteGuestModal from "./invite-guest-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { useNavigate } from "react-router-dom";
import DestinationAndDateStep from "./steps/destination-and-date-step";
import InviteGuestsStep from "./steps/invite-guest-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

function CreateTrip() {
  const [isGuestInputOpen, setIsGuestInputOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [emailsToInvite, setEmailsToInvite] = useState(["test@email.com"]);

  const [destination, setDestination] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();

  const navigate = useNavigate();

  const openGuestsInput = () => {
    setIsGuestInputOpen(true);
  };
  const closeGuestsInput = () => {
    setIsGuestInputOpen(false);
  };

  const openGuestsModal = () => {
    setIsGuestModalOpen(true);
  };
  const closeGuestsModal = () => {
    setIsGuestModalOpen(false);
  };

  const openConfirmTripModal = () => {
    setIsConfirmTripModalOpen(true);
  };

  const closeConfirmTripModal = () => {
    setIsConfirmTripModalOpen(false);
  };

  const addNewEmailToInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) {
      return;
    }

    if (emailsToInvite.includes(email)) {
      return;
    }

    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  };

  const removeEmailFromInvites = (emailToRemove: string) => {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove
    );

    setEmailsToInvite(newEmailList);
  };

   const createTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

     if (!destination) {
       return;
     }

     if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
       return;
     }

     if (emailsToInvite.length === 0) {
       return;
     }

     if (!ownerName || !ownerEmail) {
       return;
     }

     const response = await api.post("/trips", {
       destination,
       startsAt: eventStartAndEndDates.from,
       endsAt: eventStartAndEndDates.to,
       ownerName: ownerName,
       ownerEmail: ownerEmail,
       emailsToEnvite: emailsToInvite,
     });
     
     const { id } = response.data.trip

    navigate(`/trips/${id}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="logo do plann.er" />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            eventStartAndEndDates={eventStartAndEndDates}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            closeGuestsInput={closeGuestsInput}
            isGuestInputOpen={isGuestInputOpen}
            openGuestsInput={openGuestsInput}
          />

          {isGuestInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela Plann.er você automaticamente concorda{" "}
          <br />
          com nossos{" "}
          <a href="#" className="text-zinc-300 underline">
            termos de uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-zinc-300 underline">
            políticas de privacidade
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {isGuestModalOpen && (
          <InviteGuestModal
            emailsToInvite={emailsToInvite}
            addNewEmailToInvite={addNewEmailToInvite}
            closeGuestsModal={closeGuestsModal}
            removeEmailFromInvites={removeEmailFromInvites}
          />
        )}

        {isConfirmTripModalOpen && (
          <ConfirmTripModal
            setOwnerEmail={setOwnerEmail}
            setOwnerName={setOwnerName}
            closeConfirmTripModal={closeConfirmTripModal}
            createTrip={createTrip}
            destination={destination}
            eventStartAndEndDates={eventStartAndEndDates}
          />
        )}
      </div>
    </div>
  );
}

export default CreateTrip;
