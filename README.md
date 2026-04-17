<div align="center">
  <h1>mineflayer-util-plugin</h1>
  <p><strong>Utility helpers for NextGEN Mineflayer bots.</strong></p>
  <p>
    A focused collection of bot helpers for movement, ray tracing, entity math, inventory handling,
    prediction, and reusable geometry utilities.
  </p>
</div>

<p align="center">
  <a href="docs/README.md"><img src="https://img.shields.io/badge/API-Docs-2ea44f?style=for-the-badge" alt="API Docs"></a>
  <a href="examples"><img src="https://img.shields.io/badge/Examples-Available-0969da?style=for-the-badge" alt="Examples"></a>
  <a href="https://github.com/nxg-org/mineflayer-util-plugin/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-GPL--3.0-8a2be2?style=for-the-badge" alt="License"></a>
</p>

<p align="center">
  <a href="https://ko-fi.com/generel">
    <img src="https://img.shields.io/badge/Support%20the%20project-Ko--fi-ff5f5f?style=for-the-badge&logo=kofi" alt="Support on Ko-fi">
  </a>
</p>

<blockquote>
  This library exposes the plugin injector at the package root. After injecting it into a Mineflayer bot,
  the helpers are available under <code>bot.util</code>.
</blockquote>

<h2>Quick Start</h2>

<pre><code class="language-ts">import mineflayer from "mineflayer";
import inject from "@nxg-org/mineflayer-util-plugin";

const bot = mineflayer.createBot({
  host: "localhost",
  username: "UtilityBot"
});

inject(bot);

// Helpers are now available under bot.util
const dir = bot.util.getViewDir();
const nearest = bot.util.filters.nearestCrystalFilter();
</code></pre>

<h2>What Is Included</h2>

<table>
  <thead>
    <tr>
      <th align="left">Module</th>
      <th align="left">Purpose</th>
      <th align="left">Docs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>UtilFunctions</code></td>
      <td>Main aggregator attached to <code>bot.util</code></td>
      <td><a href="docs/utilFunctions.md">docs/utilFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>EntityFunctions</code></td>
      <td>Health, distance, and entity metadata helpers</td>
      <td><a href="docs/entityFunctions.md">docs/entityFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>FilterFunctions</code></td>
      <td>Nearest-entity and bot-filtering helpers</td>
      <td><a href="docs/filterFunctions.md">docs/filterFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>InventoryFunctions</code></td>
      <td>Inventory lookups and equip helpers</td>
      <td><a href="docs/inventoryFunctions.md">docs/inventoryFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>MovementFunctions</code></td>
      <td>Synchronized look and movement packet helpers</td>
      <td><a href="docs/movementFunctions.md">docs/movementFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>PredictiveFunctions</code></td>
      <td>Explosion damage prediction and world overrides</td>
      <td><a href="docs/predictiveFunctions.md">docs/predictiveFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>RayTraceFunctions</code></td>
      <td>Block and entity ray tracing helpers</td>
      <td><a href="docs/rayTracingFunctions.md">docs/rayTracingFunctions.md</a></td>
    </tr>
    <tr>
      <td><code>AABB</code>, <code>InterceptFunctions</code>, <code>RaycastIterator</code>, <code>AABBUtils</code>, <code>MathUtils</code>, <code>Task</code></td>
      <td>Public geometry and support utilities exported from the package root</td>
      <td><a href="docs/README.md">docs/README.md</a></td>
    </tr>
  </tbody>
</table>

<h2>Documentation Layout</h2>

<p>
  The full API reference lives in <a href="docs/README.md">docs/README.md</a>. Each public function file
  has its own page inside the <code>docs</code> folder so it is easy to browse module by module.
</p>

<h2>Notes</h2>

<ul>
  <li>Several helpers are version-sensitive, especially health, armor, and metadata logic.</li>
  <li><code>MovementFunctions</code> listens to bot spawn and move events to keep look synchronization accurate.</li>
  <li><code>PredictiveFunctions</code> uses a predictive world overlay for explosion estimates.</li>
</ul>

