import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getReservationHistory,
  postReservation,
} from "@/features/hotel/api/hotel-client";
import { HOTEL_KEYS } from "@/features/hotel/query-keys";
import { useSessionStore } from "@/stores/session-store";
import type { Reservation } from "@/features/hotel/types";

export function useReservationHistory() {
  const guest = useSessionStore((s) => s.guest);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...HOTEL_KEYS.HISTORY, guest?.id],
    queryFn: () => getReservationHistory(guest!.id),
    enabled: !!guest,
  });

  const rebook = useMutation({
    mutationFn: (reservation: Reservation) =>
      postReservation({
        guest_id: reservation.guest_id,
        room_type: reservation.room_type,
        guest_count: reservation.guest_count,
        check_in_day: reservation.check_in_day,
        check_out_day: reservation.check_out_day,
      }),
    onSuccess: (reservation) => {
      if (guest) {
        queryClient.setQueryData<Reservation>(
          [...HOTEL_KEYS.RESERVATION, guest.id],
          reservation
        );
        queryClient.setQueryData<Reservation[]>(
          [...HOTEL_KEYS.HISTORY, guest.id],
          (history) => (history ? [reservation, ...history] : [reservation])
        );
      }
      queryClient.invalidateQueries({ queryKey: [...HOTEL_KEYS.HISTORY, guest?.id] });
      queryClient.invalidateQueries({ queryKey: [...HOTEL_KEYS.ROOMS] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    reservations: query.data ?? [],
    isLoading: query.isLoading,
    rebook: (reservation: Reservation) => rebook.mutate(reservation),
    rebookingId: rebook.isPending ? (rebook.variables?.id ?? null) : null,
  };
}
