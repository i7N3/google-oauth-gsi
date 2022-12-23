export default function googleLogout() {
    if (typeof window === 'undefined') return;
    window.google?.accounts.id.disableAutoSelect();
}
