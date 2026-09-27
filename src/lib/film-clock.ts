/* A shared clock for rendering films frame by frame (see app/studio). When the
   <html> element carries data-film, animated components stop reading the wall
   clock and draw whatever time the film seeks to, so every captured frame is
   exact regardless of how long the capture takes. Outside the studio this
   module is inert. */

type Listener = (t: number) => void;
const listeners = new Set<Listener>();
let now = 0;

export function isFilm(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.film === "1";
}

export function onFilmTime(fn: Listener) {
  listeners.add(fn);
  fn(now);
  return () => {
    listeners.delete(fn);
  };
}

export function setFilmTime(t: number) {
  now = t;
  listeners.forEach((fn) => fn(t));
}
