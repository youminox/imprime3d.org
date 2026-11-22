export const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/imprime3d-chat";

export const OPEN_CHAT_EVENT = "i3d-open-chat";

export function openChat(prompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_CHAT_EVENT, {
      detail: prompt ? { prompt } : undefined,
    })
  );
}
