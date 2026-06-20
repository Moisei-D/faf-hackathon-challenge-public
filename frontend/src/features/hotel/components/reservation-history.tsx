import { format } from "date-fns";
import { IconLoader2, IconRefresh } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRoomType } from "@/lib/format";
import { simulationDayToDate } from "@/lib/simulation-time";
import type { Reservation } from "@/features/hotel/types";

interface ReservationHistoryProps {
  reservations: Reservation[];
  onRebook: (reservation: Reservation) => void;
  rebookingId: string | null;
  hasActiveReservation: boolean;
}

export function ReservationHistory({
  reservations,
  onRebook,
  rebookingId,
  hasActiveReservation,
}: ReservationHistoryProps) {
  if (reservations.length === 0) return null;

  // Same room type + guests + dates is the "same booking" — collapse repeats so
  // cancel → re-book → cancel doesn't show the booking twice.
  const bookingKey = (reservation: Reservation) =>
    `${reservation.room_type}|${reservation.guest_count}|${reservation.check_in_day}|${reservation.check_out_day}`;

  const dedupeBySignature = (list: Reservation[]) => {
    const seen = new Set<string>();
    return list.filter((reservation) => {
      const key = bookingKey(reservation);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const confirmedReservations = dedupeBySignature(
    reservations.filter((reservation) => reservation.status === "CONFIRMED")
  );
  const confirmedKeys = new Set(confirmedReservations.map(bookingKey));
  const cancelledReservations = dedupeBySignature(
    reservations.filter(
      (reservation) =>
        reservation.status === "CANCELLED" &&
        !confirmedKeys.has(bookingKey(reservation))
    )
  );
  const isRebooking = rebookingId !== null;

  return (
    <div data-testid="reservation-history" className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">My bookings</h3>
        <p className="text-xs text-muted-foreground">
          Cancelled reservations move to the cancelled section below, and you
          can re-book them once you do not have an active reservation.
        </p>
      </div>

      {confirmedReservations.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Active & confirmed
          </h4>
          {confirmedReservations.map((reservation) => {
            return (
              <div
                key={reservation.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card/60 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {formatRoomType(reservation.room_type)} room
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(simulationDayToDate(reservation.check_in_day), "MMM d")}
                    {" – "}
                    {format(simulationDayToDate(reservation.check_out_day), "MMM d")}
                  </span>
                </div>

                <Badge variant="default">Confirmed</Badge>
              </div>
            );
          })}
        </div>
      )}

      {cancelledReservations.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Cancelled reservations
          </h4>
          {cancelledReservations.map((reservation) => {
            return (
              <div
                key={reservation.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card/60 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {formatRoomType(reservation.room_type)} room
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(simulationDayToDate(reservation.check_in_day), "MMM d")}
                    {" – "}
                    {format(simulationDayToDate(reservation.check_out_day), "MMM d")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Cancelled</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRebook(reservation)}
                    disabled={hasActiveReservation || isRebooking}
                  >
                    {rebookingId === reservation.id ? (
                      <IconLoader2 size={14} className="mr-1 animate-spin" />
                    ) : (
                      <IconRefresh size={14} className="mr-1" />
                    )}
                    {hasActiveReservation ? "Cancel active reservation first" : "Re-book"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
