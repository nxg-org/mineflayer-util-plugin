<div align="center">
  <h1>InterceptFunctions</h1>
  <p><code>src/calcs/intercept.ts</code></p>
</div>

<p>
  Higher-level raycast wrapper that records the traversal path and returns the first intersected block.
</p>

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
      <td><code>check(from, to)</code></td>
      <td><code>BlockAndIterations</code></td>
      <td>Convenience wrapper that computes direction and range before raycasting.</td>
    </tr>
    <tr>
      <td><code>raycast(from, direction, range)</code></td>
      <td><code>BlockAndIterations</code></td>
      <td>Steps through the ray and returns the hit block, traversal iterations, and intersection point.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li>The returned iteration list is useful for debugging or visualizing traversal.</li>
  <li>This helper uses <code>RaycastIterator</code> internally.</li>
</ul>

