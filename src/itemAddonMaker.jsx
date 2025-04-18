/*___ _                    _       _     _             __  __       _             
 |_ _| |_ ___ _ __ ___    / \   __| | __| | ___  _ __ |  \/  | __ _| | _____ _ __ 
  | || __/ _ \ '_ ` _ \  / _ \ / _` |/ _` |/ _ \| '_ \| |\/| |/ _` | |/ / _ \ '__|
  | || ||  __/ | | | | |/ ___ \ (_| | (_| | (_) | | | | |  | | (_| |   <  __/ |   
 |___|\__\___|_| |_| |_/_/   \_\__,_|\__,_|\___/|_| |_|_|  |_|\__,_|_|\_\___|_|                                                                                 
    written by @yeondu1062.
*/

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import generateMcaddon from './generateMcaddon';
import './itemAddonMaker.css';

function App() {
  const [existAddonFile, setExistAddonFile] = useState(null);
  const [addonData, setAddonData] = useState({
    name: '내애드온',
    description: "애드온에 관한 간단한 설명입니다.",
    item: {
      id: 'iam:test',
      name: '먹을 수 없는 사과',
      icon: 'apple',
      maxStack: 64,
      damage: 0,
      foil: false,
      offhand: false,
      equipment: false,
    }
  });

  const getAddonDataHandleFunc = field => evd => {
    setAddonData(prev => ({ ...prev, [field]: evd.target.value }));
  };

  const getItemDataHandleFunc = (field, isCheckBox=false) => evd => {
    setAddonData(prev => ({
      ...prev,
      item: {
        ...prev.item,
        [field]: evd.target[isCheckBox ? 'checked' : 'value']
      }
    }));
  };

  const addonGenerateHandle = async () => {
    const { id, maxStack, damage } = addonData.item;
    const itemIdPattern = /^[A-Za-z]+:[A-Za-z]+$/;

    if (!addonData.name.trim()) { alert("애드온 이름을 입력해주세요."); return; }
    if (!addonData.description.trim()) { alert("애드온 설명을 입력해주세요."); return; }
    if (!itemIdPattern.test(id)) { alert("아이템ID 형식이 잘못되었습니다. (예: iam:test)"); return; }
    if (maxStack < 1 || maxStack > 64) { alert("아이템 최대 개수는 1 ~ 64 사이여야합니다."); return; }
    if (damage < 0 || damage > 10000) { alert("아이템 대미지는 0 ~ 10000 사이여야합니다."); return; }

    const blob = await generateMcaddon(existAddonFile, addonData);
    saveAs(blob, addonData.name + '.mcpack');
  };

  return (
    <div className="container">
      <h1>MCPE_아이템애드온</h1>
  
      <div className="form-group">
        <label>.mcaddon 파일에 추가 (비워두면 새로 생성)</label>
        <input type="file" accept=".mcpack"
          onChange={evd => {
            const file = evd.target.files[0];
            if (file && file.name.endsWith('.mcpack')) setExistAddonFile(file);
          }}
        />
      </div>
  
      {!existAddonFile && (
        <>
          <div className="form-group">
            <label>애드온 이름</label>
            <input value={addonData.name} onChange={getAddonDataHandleFunc('name')} />
          </div>
  
          <div className="form-group">
            <label>애드온 설명</label>
            <input value={addonData.description} onChange={getAddonDataHandleFunc('description')} />
          </div>
        </>
      )}
  
      <div className="form-group">
        <label>아이템 ID</label>
        <input
          value={addonData.item.id}
          onChange={getItemDataHandleFunc('id')}
          placeholder="예: IAM:test" required
        />
      </div>
  
      <div className="form-group">
        <label>아이템 이름</label>
        <input value={addonData.item.name} onChange={getItemDataHandleFunc('name')} />
      </div>
  
      <div className="form-group">
        <label>아이템 최대 개수</label>
        <input
          type="number" value={addonData.item.maxStack}
          onChange={getItemDataHandleFunc('maxStack')}
        />
      </div>
  
      <div className="form-group">
        <label>아이템 대미지</label>
        <input
          type="number" value={addonData.item.damage}
          onChange={getItemDataHandleFunc('damage')}
        />
      </div>
  
      <div className="form-group">
        <label>아이템 아이콘</label>
        <input value={addonData.item.icon} onChange={getItemDataHandleFunc('icon')} />
      </div>
  
      <div className="form-group">
        <label>
          <input
            type="checkbox" checked={addonData.item.foil}
            onChange={getItemDataHandleFunc('foil', true)}
          />
          아이템 발광
        </label>
      </div>
  
      <div className="form-group">
        <label>
          <input
            type="checkbox" checked={addonData.item.offhand}
            onChange={getItemDataHandleFunc('offhand', true)}
          />
          아이템 왼손 허용
        </label>
      </div>
  
      <div className="form-group">
        <label>
          <input
            type="checkbox" checked={addonData.item.equipment}
            onChange={getItemDataHandleFunc('equipment', true)}
          />
          아이템 무기 여부
        </label>
      </div>
  
      <button className="generate-button" onClick={addonGenerateHandle}>
        애드온 만들기
      </button>

      <a
        href="https://github.com/yeondu1062"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        GitHub
      </a>
    </div>
  );  
}

export default App;
