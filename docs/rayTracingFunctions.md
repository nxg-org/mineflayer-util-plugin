<div align="center">
  <h1>RayTraceFunctions</h1>
  <p><code>src/rayTracingFunctions.ts</code></p>
</div>

<p>
  Ray tracing helpers for blocks and entities. These methods combine world raycasts with AABB checks so you
  can identify the hit target, hit face, and intersection point.
</p>

<h2>Types</h2>

<table>
  <thead>
    <tr>
      <th align="left">Type</th>
      <th align="left">Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>EntityRaycastReturn</code></td>
      <td>A block or entity augmented with <code>intersect</code> and <code>face</code>.</td>
    </tr>
  </tbody>
</table>

<h2>Methods</h2>

<table>
  <thead>
    <tr>
      <th align="left">Method</th>
      <th align="left">Returns</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>entityRaytrace(startPos, dir, maxDistance = 3.5, matcher?)</code></td>
      <td><code>EntityRaycastReturn | null</code></td>
      <td>Raytraces against loaded entities after building AABBs from the bot's entity list.</td>
    </tr>
    <tr>
      <td><code>entityRaytraceRaw(startPos, dir, aabbMap, maxDistance = 3.5, matcher?)</code></td>
      <td><code>EntityRaycastReturn | null</code></td>
      <td>Low-level entity raytrace that accepts a prepared AABB map.</td>
    </tr>
    <tr>
      <td><code>entityAtEntityCursor(entity, maxDistance = 3.5)</code></td>
      <td><code>Entity | null</code></td>
      <td>Returns the entity under another entity's cursor direction, if any.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li>Entity raytracing first performs a world raycast and then compares against entity hitboxes.</li>
  <li>The returned object is augmented in-place with <code>intersect</code> and <code>face</code> when a hit is found.</li>
</ul>

