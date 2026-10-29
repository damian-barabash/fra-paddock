-- Login by phone number: the last 9 digits of profiles.phone identify the member
-- (Polish mobile without +48). Must be unique, otherwise a number could open two accounts.
-- Members without an e-mail get an internal address <digits>@telefon.fastlinepaddockclub.pl
-- (never mailed; only the auth system needs it).

create unique index if not exists profiles_phone_key
  on public.profiles (right(regexp_replace(phone, '\D', '', 'g'), 9))
  where phone is not null and length(regexp_replace(phone, '\D', '', 'g')) >= 9;
