<div align="center">
  <h1>AABB</h1>
  <p><code>src/calcs/aabb.ts</code></p>
</div>

<p>
  Public axis-aligned bounding box class used throughout the library for collision checks, ray intersection,
  and entity hitbox math.
</p>

<h2>Constructor</h2>

<pre><code class="language-ts">new AABB(x0, y0, z0, x1, y1, z1)</code></pre>

<h2>Useful Methods</h2>

<table>
  <thead>
    <tr>
      <th align="left">Method</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>minPoint()</code>, <code>maxPoint()</code></td>
      <td>Return the minimum or maximum corner as a <code>Vec3</code>.</td>
    </tr>
    <tr>
      <td><code>distanceToVec(pos)</code></td>
      <td>Returns the shortest distance from the box to a point.</td>
    </tr>
    <tr>
      <td><code>intersectsRay(org, dir)</code></td>
      <td>Returns the first ray intersection point, or <code>null</code>.</td>
    </tr>
    <tr>
      <td><code>intersects(other)</code>, <code>collides(other)</code></td>
      <td>Overlap checks with strict or inclusive bounds.</td>
    </tr>
    <tr>
      <td><code>translateVec(vec)</code>, <code>move(vec)</code>, <code>expand(x, y, z)</code></td>
      <td>Mutating or copy-returning geometry transforms.</td>
    </tr>
    <tr>
      <td><code>toShapeFromMin()</code>, <code>toShapeFromBottomMiddle()</code></td>
      <td>Converts the box into prismarine-world compatible shapes.</td>
    </tr>
    <tr>
      <td><code>getCenter()</code></td>
      <td>Returns the center point of the box.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li>Most methods mutate the current instance when they are geometry transforms.</li>
  <li>Ray helpers normalize the direction vector internally.</li>
</ul>

