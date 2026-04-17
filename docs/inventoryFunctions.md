<div align="center">
  <h1>InventoryFunctions</h1>
  <p><code>src/inventoryFunctions.ts</code></p>
</div>

<p>
  Inventory and equipment helpers for Mineflayer bots. The class wraps item lookup, hand access, and a couple
  of equip flows that try to keep the bot from getting stuck.
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
      <td><code>usingMainHand</code></td>
      <td><code>boolean</code></td>
      <td>Tracks whether the main hand is being used.</td>
    </tr>
    <tr>
      <td><code>usingOffHand</code></td>
      <td><code>boolean</code></td>
      <td>Tracks whether the off hand is being used.</td>
    </tr>
    <tr>
      <td><code>equippingMainHand</code></td>
      <td><code>boolean</code></td>
      <td>Internal flag for main-hand equip flow.</td>
    </tr>
    <tr>
      <td><code>equippingOffHand</code></td>
      <td><code>boolean</code></td>
      <td>Internal flag for off-hand equip flow.</td>
    </tr>
    <tr>
      <td><code>equippingOtherSlot</code></td>
      <td><code>boolean</code></td>
      <td>Internal flag for non-hand equip flow.</td>
    </tr>
  </tbody>
</table>

<h2>Getters</h2>

<table>
  <thead>
    <tr>
      <th align="left">Getter</th>
      <th align="left">Returns</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>equipmentSlots</code></td>
      <td><code>EquipmentDestination[]</code></td>
      <td>Returns the list of supported equipment destinations for the current bot version.</td>
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
      <td><code>getAllItems()</code></td>
      <td><code>Item[]</code></td>
      <td>Returns inventory items plus equipped items.</td>
    </tr>
    <tr>
      <td><code>getAllItemsExceptCurrent(current)</code></td>
      <td><code>Item[]</code></td>
      <td>Returns inventory and equipment items except the specified slot.</td>
    </tr>
    <tr>
      <td><code>getHandWithItem(offhand?)</code></td>
      <td><code>Item | null</code></td>
      <td>Returns the item currently in the requested hand.</td>
    </tr>
    <tr>
      <td><code>getHand(offhand = false)</code></td>
      <td><code>"hand" | "off-hand"</code></td>
      <td>Returns the correct equipment destination for a hand flag.</td>
    </tr>
    <tr>
      <td><code>findItemByID(itemId, metadata?)</code></td>
      <td><code>Item | null</code></td>
      <td>Finds the first matching item by numeric ID and optional metadata.</td>
    </tr>
    <tr>
      <td><code>findItem(name, metadata?)</code></td>
      <td><code>Item | null</code></td>
      <td>Finds the first matching item by name and optional metadata.</td>
    </tr>
    <tr>
      <td><code>has(name, metadata?)</code></td>
      <td><code>boolean</code></td>
      <td>Alias for a boolean item existence check.</td>
    </tr>
    <tr>
      <td><code>equipItemRaw(item, dest)</code></td>
      <td><code>Promise&lt;boolean&gt;</code></td>
      <td>Equips an item unless it is already in the destination slot.</td>
    </tr>
    <tr>
      <td><code>customEquip(item, destination, retries = 1)</code></td>
      <td><code>Promise&lt;boolean&gt;</code></td>
      <td>Retries equip and attempts to clear the cursor if the equip flow gets stuck.</td>
    </tr>
  </tbody>
</table>

<h2>Notes</h2>

<ul>
  <li><code>findItemByID</code> and <code>findItem</code> only check metadata when the metadata argument is truthy.</li>
  <li><code>equipmentSlots</code> omits off-hand on versions that do not support it.</li>
</ul>

