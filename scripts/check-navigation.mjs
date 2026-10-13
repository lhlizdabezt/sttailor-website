import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../src/scripts/site.js", import.meta.url), "utf8");

function navigation(mobile) {
  const listeners = {};
  const classes = new Set();
  const toggle = { addEventListener: (type, handler) => { listeners[`toggle:${type}`] = handler; }, setAttribute() {}, contains: (target) => target === toggle };
  const link = { addEventListener() {} };
  const nav = {
    querySelectorAll: () => [link], contains: (target) => target === link,
    classList: { contains: (name) => classes.has(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) }
  };
  const document = {
    querySelector: (selector) => selector === "[data-nav-toggle]" ? toggle : selector === "[data-site-nav]" ? nav : null,
    querySelectorAll: () => [],
    addEventListener: (type, handler) => { (listeners[type] ??= []).push(handler); },
    body: { classList: { toggle() {} } }
  };
  runInNewContext(source, {
    document,
    window: { matchMedia: () => ({ matches: mobile }), addEventListener() {}, location: { pathname: "/" } },
    Element: class Element {}
  });
  return { toggle, link, classes, focus: (target) => listeners.focusin.forEach((handler) => handler({ target })), open: () => listeners["toggle:click"]() };
}

test("mobile navigation closes only when keyboard focus leaves its controls", () => {
  const menu = navigation(true);
  menu.open();
  menu.focus(menu.link);
  assert.equal(menu.classes.has("is-open"), true);
  menu.focus(menu.toggle);
  assert.equal(menu.classes.has("is-open"), true);
  menu.focus({});
  assert.equal(menu.classes.has("is-open"), false);
});

test("focus movement does not close desktop navigation", () => {
  const menu = navigation(false);
  menu.open();
  menu.focus({});
  assert.equal(menu.classes.has("is-open"), true);
});
