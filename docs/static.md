<div align="center">
  <h1>Static Utilities</h1>
  <p><code>src/static/*</code></p>
</div>

<p>
  Public utility namespaces and helpers exported from the package root.
</p>

<h2>AABBUtils</h2>

<table>
  <thead>
    <tr>
      <th align="left">Helper</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>getBlockAABB(block, height = 1)</code></td>
      <td>Creates a world-space AABB for a block.</td>
    </tr>
    <tr>
      <td><code>getBlockPosAABB(blockPos, height = 1)</code></td>
      <td>Creates an AABB from a block position vector.</td>
    </tr>
    <tr>
      <td><code>getEntityAABB(entity)</code></td>
      <td>Returns a version-aware AABB for an entity.</td>
    </tr>
    <tr>
      <td><code>getPlayerAABB(entity)</code></td>
      <td>Creates a player-shaped AABB and translates it to the entity position.</td>
    </tr>
    <tr>
      <td><code>getPlayerAABBRaw(position, height = 1.8)</code></td>
      <td>Creates a player-shaped AABB from a raw position.</td>
    </tr>
    <tr>
      <td><code>getEntityAABBRaw(entity)</code></td>
      <td>Creates an entity AABB from raw position, height, and width values.</td>
    </tr>
  </tbody>
</table>

<h2>MathUtils</h2>

<table>
  <thead>
    <tr>
      <th align="left">Helper</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>toNotchianYaw</code>, <code>toNotchianPitch</code></td>
      <td>Convert radians to Notchian packet angles.</td>
    </tr>
    <tr>
      <td><code>fromNotchianYaw</code>, <code>fromNotchianPitch</code></td>
      <td>Convert Notchian packet angles back to radians.</td>
    </tr>
    <tr>
      <td><code>euclideanMod</code></td>
      <td>Positive modulo helper.</td>
    </tr>
    <tr>
      <td><code>pointToYawAndPitch(bot, point)</code></td>
      <td>Returns the yaw and pitch needed to face a point.</td>
    </tr>
    <tr>
      <td><code>dirToYawAndPitch(dir)</code></td>
      <td>Returns yaw and pitch from a direction vector.</td>
    </tr>
    <tr>
      <td><code>getYaw(origin, destination)</code></td>
      <td>Returns the yaw between two points on the XZ plane.</td>
    </tr>
    <tr>
      <td><code>getViewDir(pitch, yaw)</code></td>
      <td>Returns a unit view direction vector.</td>
    </tr>
    <tr>
      <td><code>yawPitchAndSpeedToDir(yaw, pitch, speed)</code></td>
      <td>Returns a direction vector scaled by speed.</td>
    </tr>
  </tbody>
</table>

<h2>Task</h2>

<table>
  <thead>
    <tr>
      <th align="left">Helper</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>new Task()</code></td>
      <td>Creates a cancellable promise wrapper.</td>
    </tr>
    <tr>
      <td><code>Task.createTask()</code></td>
      <td>Factory for a new task.</td>
    </tr>
    <tr>
      <td><code>Task.createDoneTask()</code></td>
      <td>Returns an already-finished task object.</td>
    </tr>
  </tbody>
</table>

