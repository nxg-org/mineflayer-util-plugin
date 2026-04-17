<div align="center">
  <h1>FilterFunctions</h1>
  <p><code>src/filterFunctions.ts</code></p>
</div>

<p>
  Entity filtering helpers centered around Mineflayer's nearest-entity lookup. This module is useful when you
  want to pick targets, ignore your own bots, or search for a specific class of entities.
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
      <td><code>specificNames</code></td>
      <td><code>string[]</code></td>
      <td>Allowed player names for named-target filtering.</td>
    </tr>
    <tr>
      <td><code>botNames</code></td>
      <td><code>string[]</code></td>
      <td>Names that should be excluded when looking for non-bot players.</td>
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
      <td><code>addBotName(name)</code></td>
      <td><code>void</code></td>
      <td>Adds a bot name to the exclusion list.</td>
    </tr>
    <tr>
      <td><code>getNearestEntity(func, ...args)</code></td>
      <td><code>Entity | null</code></td>
      <td>Returns the nearest entity that passes the provided predicate.</td>
    </tr>
    <tr>
      <td><code>static getNearestEntity(bot, func, ...args)</code></td>
      <td><code>Entity | null</code></td>
      <td>Static version of the nearest-entity lookup.</td>
    </tr>
    <tr>
      <td><code>allButOtherBotsFilter()</code></td>
      <td><code>Entity | null</code></td>
      <td>Finds the nearest player whose username is not in <code>botNames</code>.</td>
    </tr>
    <tr>
      <td><code>static allButOtherBotsFilter(bot, ...names)</code></td>
      <td><code>Entity | null</code></td>
      <td>Static helper for the same bot-exclusion lookup.</td>
    </tr>
    <tr>
      <td><code>specificNamesFilter()</code></td>
      <td><code>Entity | null</code></td>
      <td>Finds the nearest player whose username is in <code>specificNames</code>.</td>
    </tr>
    <tr>
      <td><code>static specificNamesFilter(bot, ...names)</code></td>
      <td><code>Entity | null</code></td>
      <td>Static helper for named player lookup.</td>
    </tr>
    <tr>
      <td><code>nearestCrystalFilter()</code></td>
      <td><code>Entity | null</code></td>
      <td>Finds the nearest end crystal.</td>
    </tr>
    <tr>
      <td><code>static nearestCrystalFilter(bot)</code></td>
      <td><code>Entity | null</code></td>
      <td>Static helper for finding the nearest end crystal.</td>
    </tr>
    <tr>
      <td><code>crystalAtPosition(position)</code></td>
      <td><code>Entity | null</code></td>
      <td>Finds a crystal whose translated position matches the supplied block position.</td>
    </tr>
  </tbody>
</table>

