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
  const viewport = {
    matches: mobile,
    addEventListener(type, handler) { listeners[`viewport:${type}`] = handler; }
  };
  runInNewContext(source, {
    document,
    window: { matchMedia: () => viewport, location: { pathname: "/" } },
    Element: class Element {}
  });
  return {
    toggle, link, classes, nav,
    focus: (target) => listeners.focusin.forEach((handler) => handler({ target })),
    open: () => listeners["toggle:click"](),
    resize(matches) {
      viewport.matches = matches;
      listeners["viewport:change"]();
    }
  };
}

test("mobile navigation closes only when keyboard focus leaves its controls", () => {
  const menu = navigation(true);
  assert.equal(menu.nav.inert, true);
  menu.open();
  assert.equal(menu.nav.inert, false);
  menu.focus(menu.link);
  assert.equal(menu.classes.has("is-open"), true);
  menu.focus(menu.toggle);
  assert.equal(menu.classes.has("is-open"), true);
  menu.focus({});
  assert.equal(menu.classes.has("is-open"), false);
  assert.equal(menu.nav.inert, true);
});

test("focus movement does not close desktop navigation", () => {
  const menu = navigation(false);
  menu.open();
  menu.focus({});
  assert.equal(menu.classes.has("is-open"), true);
});

test("crossing the layout breakpoint resets the menu and keeps desktop links available", () => {
  const menu = navigation(true);
  menu.open();
  menu.resize(false);
  assert.equal(menu.classes.has("is-open"), false);
  assert.equal(menu.nav.inert, false);
  menu.resize(true);
  assert.equal(menu.nav.inert, true);
});
