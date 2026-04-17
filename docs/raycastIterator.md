<div align="center">
  <h1>RaycastIterator</h1>
  <p><code>src/calcs/iterators.ts</code></p>
</div>

<p>
  Iterator for stepping through world blocks along a ray. This is the low-level traversal primitive used by
  the raycast and intercept helpers.
</p>

<h2>Related Export</h2>

<table>
  <thead>
    <tr>
      <th align="left">Export</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>BlockFace</code></td>
      <td>Enum describing which face was crossed or intersected.</td>
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
      <td><code>intersect(shapes, offset)</code></td>
      <td><code>Intersection | null</code></td>
      <td>Checks the current ray against a list of translated block or entity shapes.</td>
    </tr>
    <tr>
      <td><code>next()</code></td>
      <td><code>{ x; y; z; face } | null</code></td>
      <td>Advances to the next traversed block along the ray.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li>Construct the iterator with a start position, direction vector, and maximum distance.</li>
  <li><code>intersect</code> reports the first matching shape hit for the current cell.</li>
</ul>

