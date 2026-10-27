import "@testing-library/jest-dom/vitest";

// jsdom ships a canvas element without a drawing context. The 3D scene is
// decorative, so tests only need the element to render without a context.
if (typeof HTMLCanvasElement !== "undefined") {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: () => null,
    writable: true,
  });
}
