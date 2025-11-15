import assert from "node:assert/strict";
import test from "node:test";
import { boundsFromCorners, clampLatitude, MAX_MERCATOR_LATITUDE, normalizeLongitude } from "../src/geo/coordinates.ts";
import { positionToTile, tileBounds } from "../src/geo/tiles.ts";

test("wraps longitude and clamps latitude to the Web Mercator limits", () => {
  assert.equal(normalizeLongitude(180), -180);
  assert.equal(normalizeLongitude(-181), 179);
  assert.equal(normalizeLongitude(540), -180);
  assert.equal(clampLatitude(90), MAX_MERCATOR_LATITUDE);
  assert.equal(clampLatitude(-90), -MAX_MERCATOR_LATITUDE);
  assert.throws(() => normalizeLongitude(Infinity), RangeError);
});

test("projects Cape Town and clamps extreme coordinates to valid tile indices", () => {
  assert.deepEqual(positionToTile({ lat: -33.9249, lng: 18.4241 }, 12), {
    z: 12, x: 2257, y: 2458,
  });
  assert.deepEqual(positionToTile({ lat: 90, lng: -180 }, 2), { z: 2, x: 0, y: 0 });
  assert.deepEqual(positionToTile({ lat: -90, lng: 179.99 }, 2), { z: 2, x: 3, y: 3 });
  assert.throws(() => positionToTile({ lat: 0, lng: 0 }, 2.5), RangeError);
});

test("calculates tile bounds including the east and south world edges", () => {
  const world = tileBounds({ z: 0, x: 0, y: 0 });
  assert.equal(world.west, -180);
  assert.equal(world.east, 180);
  assert.ok(Math.abs(world.north - MAX_MERCATOR_LATITUDE) < 1e-12);
  assert.ok(Math.abs(world.south + MAX_MERCATOR_LATITUDE) < 1e-12);
  const southeast = tileBounds({ z: 1, x: 1, y: 1 });
  assert.equal(southeast.north, 0);
  assert.equal(southeast.west, 0);
  assert.throws(() => tileBounds({ z: 2, x: 4, y: 0 }), RangeError);
});

test("orders rectangular bounds regardless of which corner is selected first", () => {
  const northwest = { lng: 18.3, lat: -33.8 };
  const southeast = { lng: 18.65, lat: -34.1 };
  assert.deepEqual(boundsFromCorners(southeast, northwest), {
    west: 18.3, south: -34.1, east: 18.65, north: -33.8,
  });
  assert.deepEqual(boundsFromCorners(northwest, southeast), boundsFromCorners(southeast, northwest));
});
