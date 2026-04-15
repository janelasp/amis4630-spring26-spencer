export const AUTH_LOGOUT_EVENT = 'buckeyeMarketplace:logout';

export function emitAuthLogout(): void {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
}
