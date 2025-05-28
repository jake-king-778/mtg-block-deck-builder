export default function getUrl() {
    const isLocal = window.location.hostname === "localhost";
    return isLocal ? "http://localhost:8000" : window.location.origin;
}
