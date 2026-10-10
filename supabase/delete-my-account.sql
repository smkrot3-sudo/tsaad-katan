-- צעד קטן: פונקציה למחיקת חשבון (המשתמש מוחק את עצמו וכל הנתונים שלו נמחקים יחד איתו)
-- להדביק ב-Supabase: פרויקט tsaad-katan > SQL Editor > New query > Run
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = (select auth.uid());
end $$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
