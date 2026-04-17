<div align="center">
  <h1>PredictiveFunctions</h1>
  <p><code>src/predictiveFunctions.ts</code></p>
</div>

<p>
  Explosion-damage prediction helpers backed by a predictive world overlay. This module is geared toward
  estimating damage against the bot or another entity without needing to wait for live-world updates.
</p>

<h2>State</h2>

<table>
  <thead>
    <tr>
      <th align="left">Property</th>
      <th align="left">Type</th>
      <th align="left">Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>world</code></td>
      <td><code>PredictiveWorld</code></td>
      <td>Overlay world used for simulated block placement and removal.</td>
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
      <td><code>getDamageWithEffects(damage, effects)</code></td>
      <td><code>number</code></td>
      <td>Applies resistance-style potion effects to incoming damage.</td>
    </tr>
    <tr>
      <td><code>placeBlocks(blocks)</code></td>
      <td><code>void</code></td>
      <td>Adds predicted blocks to the overlay world.</td>
    </tr>
    <tr>
      <td><code>removePredictedBlocks(positions, force = false)</code></td>
      <td><code>void</code></td>
      <td>Removes predicted blocks from the overlay world.</td>
    </tr>
    <tr>
      <td><code>selfExplosionDamage(sourcePos, power, rawDamages = false)</code></td>
      <td><code>number</code></td>
      <td>Estimates explosion damage dealt to the bot.</td>
    </tr>
    <tr>
      <td><code>getExplosionDamage(targetEntity, sourcePos, power, rawDamages = false)</code></td>
      <td><code>number</code></td>
      <td>Estimates explosion damage dealt to another entity.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li>Damage calculations are version-aware for armor and effect indexes.</li>
  <li>Raw damage mode skips the post-processing modifiers that depend on armor, enchantments, and effects.</li>
  <li>The module samples exposure through raycasts, so results are only as exact as the current world and overlay state.</li>
</ul>

