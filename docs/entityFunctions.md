<div align="center">
  <h1>EntityFunctions</h1>
  <p><code>src/entityFunctions.ts</code></p>
</div>

<p>
  Helpers for entity state, health parsing, and distance calculations. Several methods are version-sensitive
  because Minecraft stores metadata differently across releases.
</p>

<h2>Constructor</h2>

<table>
  <thead>
    <tr>
      <th align="left">Signature</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>new EntityFunctions(bot)</code></td>
      <td>Creates the helper object and selects the health metadata slot based on bot version.</td>
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
      <td><code>isMainHandActive(entity?)</code></td>
      <td><code>boolean</code></td>
      <td>Checks whether the entity metadata indicates main-hand use.</td>
    </tr>
    <tr>
      <td><code>isOffHandActive(entity?)</code></td>
      <td><code>boolean</code></td>
      <td>Checks whether the entity metadata indicates off-hand use.</td>
    </tr>
    <tr>
      <td><code>getHealth(entity?)</code></td>
      <td><code>number</code></td>
      <td>Returns health from entity metadata, falling back to bot health when needed.</td>
    </tr>
    <tr>
      <td><code>getHealthFromMetadata(metadata)</code></td>
      <td><code>number</code></td>
      <td>Reads health directly from a full metadata array.</td>
    </tr>
    <tr>
      <td><code>getHealthChange(packetMetadata, entity)</code></td>
      <td><code>number</code></td>
      <td>Computes health delta from packet metadata versus current entity metadata.</td>
    </tr>
    <tr>
      <td><code>entityDistance(entity)</code></td>
      <td><code>number</code></td>
      <td>Distance between the bot and the target entity.</td>
    </tr>
    <tr>
      <td><code>eyeDistanceToEntity(entity)</code></td>
      <td><code>number</code></td>
      <td>Distance from the bot's eye position to the entity's AABB.</td>
    </tr>
    <tr>
      <td><code>eyeDistanceBetweenEntities(first, second)</code></td>
      <td><code>number</code></td>
      <td>Distance from the first entity's eye position to the second entity's AABB.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li><code>healthSlot</code> is derived from the bot's Minecraft version.</li>
  <li>Distance helpers use <code>AABBUtils</code> to account for entity hitboxes instead of treating entities as points.</li>
</ul>

