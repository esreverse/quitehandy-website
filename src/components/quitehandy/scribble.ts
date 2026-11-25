/**
 * Hand-drawn lines for the documents on the sheets.
 *
 * The wireframes stay ordinary HTML and CSS; their borders and bars are measured and drawn again
 * as slightly wobbly strokes on a canvas behind the text, the CSS ones hidden meanwhile
 * (`data-scribbled`, see SheetContent.astro).
 */
const SIDES = ['Top', 'Right', 'Bottom', 'Left'] as const;

/** How far a hand strays at `along` px of a line, softly, every `seed` its own way (-1 … 1). */
function stray(along: number, seed: number) {
  return Math.sin(along / 23 + seed * 2.3) * 0.5 + Math.sin(along / 61 + seed * 4.1) * 0.35 + Math.sin(along / 9 + seed) * 0.15;
}

/** Strokes `points` as if drawn by hand, straying up to `wobble` px. */
export function scribblePath(ctx: CanvasRenderingContext2D, points: [number, number][], seed: number, wobble: number) {
  ctx.beginPath();
  let along = 0;
  points.forEach(([x, y], i) => {
    if (i > 0) along += Math.hypot(x - points[i - 1][0], y - points[i - 1][1]);
    ctx.lineTo(x + stray(along, seed) * wobble, y + stray(along, seed + 7) * wobble);
  });
}

/** Points every few px from one to the other. */
export function straight(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4));
  return Array.from({ length: steps + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps]);
}

/** A rounded rectangle's outline, clockwise from its top left, closed. */
function outline(x: number, y: number, w: number, h: number, radius: number): [number, number][] {
  const r = Math.min(radius, w / 2, h / 2);
  const corner = (cx: number, cy: number, from: number): [number, number][] => {
    const steps = Math.max(2, Math.ceil((r * Math.PI) / 2 / 4));
    return Array.from({ length: steps + 1 }, (_, i) => {
      const a = from + (Math.PI / 2) * (i / steps);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
  };
  return [
    ...straight(x + r, y, x + w - r, y),
    ...corner(x + w - r, y + r, -Math.PI / 2),
    ...straight(x + w, y + r, x + w, y + h - r),
    ...corner(x + w - r, y + h - r, 0),
    ...straight(x + w - r, y + h, x + r, y + h),
    ...corner(x + r, y + h - r, Math.PI / 2),
    ...straight(x, y + h - r, x, y + r),
    ...corner(x + r, y + r, Math.PI),
  ];
}

/** Draws the page's borders and bars by hand, again whenever it changes size. */
export function scribblePage(page: HTMLElement) {
  const body = page.querySelector<HTMLElement>('.page__body')!;
  const canvas = page.querySelector<HTMLCanvasElement>('.page__wires')!;
  const ctx = canvas.getContext('2d')!;

  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const area = canvas.getBoundingClientRect();
    canvas.width = Math.round(area.width * dpr);
    canvas.height = Math.round(area.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const wobble = Math.max(page.offsetWidth * 0.0022, 0.8);

    // measured with the CSS look on
    page.removeAttribute('data-scribbled');
    body.querySelectorAll<HTMLElement>('*').forEach((el, seed) => {
      if (el === canvas) return;
      const style = getComputedStyle(el);
      const width = SIDES.map((side) => parseFloat(style[`border${side}Width`]));
      const line = Math.max(...width);
      const filled = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent';
      if (!line && !filled) return;
      const box = el.getBoundingClientRect();
      const x = box.left - area.left + line / 2;
      const y = box.top - area.top + line / 2;
      const w = box.width - line;
      const h = box.height - line;
      ctx.globalAlpha = parseFloat(style.opacity);
      // small things stray less, so dots stay dots
      const reach = wobble * Math.min(1, Math.min(box.width, box.height) / 24 + 0.2);
      const radius = style.borderTopLeftRadius.endsWith('%') ? Math.min(w, h) / 2 : parseFloat(style.borderTopLeftRadius);
      const all = outline(x, y, w, h, radius);
      if (filled) {
        scribblePath(ctx, all, seed, reach);
        ctx.fillStyle = style.backgroundColor;
        ctx.fill();
      }
      if (!line) return;
      ctx.lineWidth = line;
      ctx.strokeStyle = style[`border${SIDES[width.indexOf(line)]}Color`];
      if (width.every(Boolean)) {
        scribblePath(ctx, all, seed, reach);
        ctx.stroke();
        return;
      }
      const edges = [
        straight(x, y, x + w, y),
        straight(x + w, y, x + w, y + h),
        straight(x + w, y + h, x, y + h),
        straight(x, y + h, x, y),
      ];
      // neighbouring sides meet: each starts where the one before ends
      const runs: [number, number][][] = [];
      const start = width.findIndex((v, i) => v && !width[(i + 3) % 4]);
      for (let i = 0; i < 4; i++) {
        const side = (start + i) % 4;
        if (!width[side]) continue;
        if (width[(side + 3) % 4] && runs.length) runs[runs.length - 1].push(...edges[side]);
        else runs.push([...edges[side]]);
      }
      runs.forEach((run) => {
        scribblePath(ctx, run, seed, wobble);
        ctx.stroke();
      });
    });
    ctx.globalAlpha = 1;
    page.setAttribute('data-scribbled', '');
  };
  new ResizeObserver(draw).observe(page);
  document.fonts.ready.then(draw);
}
