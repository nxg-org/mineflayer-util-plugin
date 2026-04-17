<div align="center">
  <h1>UtilFunctions</h1>
  <p><code>src/utilFunctions.ts</code></p>
</div>

<p>
  The main wrapper exposed as <code>bot.util</code>. It bundles the feature-specific helper classes into a
  single entry point so callers can work with one namespace instead of instantiating helpers manually.
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
      <td><code>new UtilFunctions(bot)</code></td>
      <td>Creates the helper bundle for a Mineflayer bot.</td>
    </tr>
  </tbody>
</table>

<h2>Properties</h2>

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
      <td><code>inv</code></td>
      <td><code>InventoryFunctions</code></td>
      <td>Inventory helpers.</td>
    </tr>
    <tr>
      <td><code>move</code></td>
      <td><code>MovementFunctions</code></td>
      <td>Movement and look synchronization helpers.</td>
    </tr>
    <tr>
      <td><code>entity</code></td>
      <td><code>EntityFunctions</code></td>
      <td>Entity math and metadata helpers.</td>
    </tr>
    <tr>
      <td><code>predict</code></td>
      <td><code>PredictiveFunctions</code></td>
      <td>Damage prediction and simulated world helpers.</td>
    </tr>
    <tr>
      <td><code>filters</code></td>
      <td><code>FilterFunctions</code></td>
      <td>Nearest entity filtering helpers.</td>
    </tr>
    <tr>
      <td><code>raytrace</code></td>
      <td><code>RayTraceFunctions</code></td>
      <td>Block and entity ray tracing helpers.</td>
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
      <td><code>getViewDir()</code></td>
      <td><code>Vec3</code></td>
      <td>Returns the bot's current look direction as a vector.</td>
    </tr>
  </tbody>
</table>

<h2>Example</h2>

<pre><code class="language-ts">inject(bot);

const viewDir = bot.util.getViewDir();
const nearestPlayer = bot.util.filters.getNearestEntity(
  (entity) =&gt; entity.type === "player"
);</code></pre>

