import { v4 as uuid } from 'uuid';
import JSZip from 'jszip';

export default async function generateMcaddon(existAddonFile, addonData) {
  const { name, description, item } = addonData;
  const manifest = {
    format_version: 2,
    header: {
      name, description,
      uuid: uuid(),
      version: [1, 0, 0],
      min_engine_version: [1, 21, 70]
    },
    modules: [{
      type: 'data',
      uuid: uuid(),
      version: [1, 0, 0]
    }]
  };
  
  const itemJson = {
    'format_version': '1.20.50',
    'minecraft:item': {
      description: {
        identifier: item.id,
        category: 'equipment'
      },
      components: {
        'minecraft:max_stack_size': parseInt(item.maxStack),
        'minecraft:damage': parseInt(item.damage),
        'minecraft:hand_equipped': item.equipment,
        'minecraft:glint': item.foil,
        'minecraft:allow_off_hand': item.offhand,
        'minecraft:icon': { texture: item.icon },
        'minecraft:display_name': { value: item.name }
      }
    }
  };

  let zip = new JSZip();
  if (existAddonFile) {
    const content = await existAddonFile.arrayBuffer();
    zip = await JSZip.loadAsync(content);
  } else zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  zip.folder('items').file(item.id.split(':')[1] + '.json', JSON.stringify(itemJson, null, 2));
  return await zip.generateAsync({ type: 'blob' });
}
