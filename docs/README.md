<div align="center">
  <h1>API Reference</h1>
  <p><strong>Module-by-module documentation for the Mineflayer utility plugin.</strong></p>
</div>

<h2>Public Entry Point</h2>

<table>
  <thead>
    <tr>
      <th align="left">Export</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>default inject(bot)</code></td>
      <td>Attaches <code>bot.util</code> and installs the utility wrapper.</td>
    </tr>
    <tr>
      <td><code>AABB</code></td>
      <td>Axis-aligned bounding box helper used across ray tracing and collision math.</td>
    </tr>
    <tr>
      <td><code>InterceptFunctions</code></td>
      <td>Raycast helper that returns both the hit block and the traversal path.</td>
    </tr>
    <tr>
      <td><code>RaycastIterator</code></td>
      <td>Iterator used to step through blocks along a ray.</td>
    </tr>
    <tr>
      <td><code>BlockFace</code></td>
      <td>Enum describing which face a ray intersected.</td>
    </tr>
    <tr>
      <td><code>AABBUtils</code></td>
      <td>Namespace of AABB builders for blocks, entities, and positions.</td>
    </tr>
    <tr>
      <td><code>MathUtils</code></td>
      <td>Angle, velocity, and direction helpers.</td>
    </tr>
    <tr>
      <td><code>Task</code></td>
      <td>Typed promise wrapper for cancellable or finishable tasks.</td>
    </tr>
  </tbody>
</table>

<h2>Module Pages</h2>

<table>
  <thead>
    <tr>
      <th align="left">Page</th>
      <th align="left">Focus</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="utilFunctions.md">utilFunctions.md</a></td>
      <td>Main <code>bot.util</code> wrapper and helper aggregation</td>
    </tr>
    <tr>
      <td><a href="entityFunctions.md">entityFunctions.md</a></td>
      <td>Entity health and distance helpers</td>
    </tr>
    <tr>
      <td><a href="filterFunctions.md">filterFunctions.md</a></td>
      <td>Nearest entity and bot filtering helpers</td>
    </tr>
    <tr>
      <td><a href="inventoryFunctions.md">inventoryFunctions.md</a></td>
      <td>Inventory search and equipment helpers</td>
    </tr>
    <tr>
      <td><a href="movementFunctions.md">movementFunctions.md</a></td>
      <td>Look synchronization and teleport packet helpers</td>
    </tr>
    <tr>
      <td><a href="predictiveFunctions.md">predictiveFunctions.md</a></td>
      <td>Explosion prediction and simulated block handling</td>
    </tr>
    <tr>
      <td><a href="rayTracingFunctions.md">rayTracingFunctions.md</a></td>
      <td>Entity and block ray tracing helpers</td>
    </tr>
    <tr>
      <td><a href="aabb.md">aabb.md</a></td>
      <td>Public <code>AABB</code> geometry class</td>
    </tr>
    <tr>
      <td><a href="interceptFunctions.md">interceptFunctions.md</a></td>
      <td>Block raycast wrapper around the iterator</td>
    </tr>
    <tr>
      <td><a href="raycastIterator.md">raycastIterator.md</a></td>
      <td>Ray traversal iterator and face enum</td>
    </tr>
    <tr>
      <td><a href="static.md">static.md</a></td>
      <td><code>AABBUtils</code>, <code>MathUtils</code>, and <code>Task</code></td>
    </tr>
  </tbody>
</table>

<h2>Compatibility Note</h2>

<blockquote>
  Some helpers depend on Mineflayer registry details, entity metadata indexes, or version-specific
  equipment slots. If you are targeting multiple Minecraft versions, verify the method behavior against
  the version you ship against.
</blockquote>

