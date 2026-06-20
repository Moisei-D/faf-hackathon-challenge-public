import { api } from "@/lib/api-client";
import {
  ReservationSchema,
  ReservationHistorySchema,
  RoomsResponseSchema,
  CancelReservationResponseSchema,
  type PostReservationRequest,
  type Reservation,
  type RoomsResponse,
  type CancelReservationResponse,
} from "@/features/hotel/types";

export function getRooms(): Promise<RoomsResponse> {
  return api.hotel.get(RoomsResponseSchema, "/rooms");
}

export function postReservation(
  body: PostReservationRequest
): Promise<Reservation> {
  return api.hotel.post(ReservationSchema, "/reservation", body);
}

export function getReservationByGuest(
  guestId: string
): Promise<Reservation | null> {
  return api.hotel.getOrNull(
    ReservationSchema,
    `/reservation/by-guest/${guestId}`
  );
}

export function getReservationHistory(
  guestId: string
): Promise<Reservation[]> {
  return api.hotel.get(
    ReservationHistorySchema,
    `/reservation/by-guest/${guestId}/history`
  );
}

export function cancelReservation(
  id: string
): Promise<CancelReservationResponse> {
  return api.hotel.delete(CancelReservationResponseSchema, `/reservation/${id}`);
}
