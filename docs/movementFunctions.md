<div align="center">
  <h1>MovementFunctions</h1>
  <p><code>src/movementFunctions.ts</code></p>
</div>

<p>
  Movement and orientation helpers that keep Mineflayer's internal state and the client's rotation packets
  in sync. This module is useful when you need a precise look packet, a synchronized look call, or a simple
  packet-level teleport helper.
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
      <td><code>lookSync(yaw, pitch, force = true, epsilon)</code></td>
      <td><code>Promise&lt;void&gt;</code></td>
      <td>Calls <code>bot.look</code> and waits until the bot's rotation is actually synced.</td>
    </tr>
    <tr>
      <td><code>lookAtSync(pos, force = true, epsilon)</code></td>
      <td><code>Promise&lt;void&gt;</code></td>
      <td>Computes yaw and pitch from a position and then runs <code>lookSync</code>.</td>
    </tr>
    <tr>
      <td><code>forceLook(yaw, pitch, update = false, onGround?)</code></td>
      <td><code>void</code></td>
      <td>Sends a raw look packet directly to the client connection.</td>
    </tr>
    <tr>
      <td><code>forceLookAt(pos, update = false, onGround?)</code></td>
      <td><code>void</code></td>
      <td>Computes a look direction from a position and sends the packet directly.</td>
    </tr>
    <tr>
      <td><code>lazyTeleport(endPos, steps = 1, update = false)</code></td>
      <td><code>void</code></td>
      <td>Walks through a sequence of position packets toward the destination.</td>
    </tr>
  </tbody>
</table>

<h2>Behavior Notes</h2>

<ul>
  <li>The constructor listens for <code>spawn</code> and <code>move</code> events to track the last sent rotation.</li>
  <li><code>lookSync</code> waits for the bot's state to match the requested yaw and pitch before resolving.</li>
  <li><code>lazyTeleport</code> stops if a sampled block is missing, which keeps it from blindly walking into unloaded space.</li>
</ul>

