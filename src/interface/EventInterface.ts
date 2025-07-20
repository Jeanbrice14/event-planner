export interface EventInterface {
  id: number,
  name: string,
  description: string | null,
  location: string,
  capacity: number,
  waitListCapacity: number,
  status: string,
  starts_at: string,
  ends_at: string,
  is_happening: boolean,
  is_participant: boolean,
  is_past: boolean,
  is_waiting: boolean,
  can_add_in_waitList: boolean,
  can_add_new_participant: boolean
  participants: { id: number }[]
}
