import React, { useState } from 'react';
import { Code2, Terminal, Save, Play, Trash2, FolderOpen, Rocket, Minimize2, Square, X, Plus } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface Tab {
  id: string;
  name: string;
  content: string;
  isEditing: boolean;
}

function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', name: 'Untitled Tab', content: '-- Welcome to AWP!', isEditing: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [isAttached, setIsAttached] = useState(false);
  const [showLaunchMessage, setShowLaunchMessage] = useState(false);

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      name: 'Untitled Tab',
      content: '',
      isEditing: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const removeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const startEditingTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(tabs.map(tab => ({
      ...tab,
      isEditing: tab.id === tabId
    })));
  };

  const updateTabName = (tabId: string, newName: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, name: newName || 'Untitled Tab', isEditing: false }
        : tab
    ));
  };

  const handleTabNameKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter') {
      updateTabName(tabId, (e.target as HTMLInputElement).value);
    }
  };

  const updateTabContent = (value: string | undefined) => {
    setTabs(tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, content: value || '' }
        : tab
    ));
  };

  const handleLaunch = () => {
    setShowLaunchMessage(true);
    setTimeout(() => {
      setIsAttached(true);
      setTimeout(() => {
        setShowLaunchMessage(false);
      }, 2000);
    }, 500);
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-300 flex flex-col">
      {/* Header */}
      <header className="bg-[#2d2d2d] p-2 flex items-center justify-between border-b border-[#3d3d3d]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            <span className="font-bold">AWP.GG</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Scripting</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:bg-[#3d3d3d] p-1 rounded">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button className="hover:bg-[#3d3d3d] p-1 rounded">
            <Square className="w-4 h-4" />
          </button>
          <button className="hover:bg-[#3d3d3d] p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="bg-[#252526] px-2 flex items-center border-b border-[#3d3d3d] overflow-x-auto">
        <div className="flex items-center">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-3 py-2 text-sm flex items-center gap-2 cursor-pointer ${
                activeTabId === tab.id
                  ? 'bg-[#1e1e1e] border-t-2 border-blue-500'
                  : 'hover:bg-[#2d2d2d]'
              }`}
            >
              {tab.isEditing ? (
                <input
                  type="text"
                  defaultValue={tab.name}
                  className="bg-[#3d3d3d] px-2 py-0.5 rounded outline-none w-24"
                  onBlur={(e) => updateTabName(tab.id, e.target.value)}
                  onKeyDown={(e) => handleTabNameKeyDown(e, tab.id)}
                  autoFocus
                />
              ) : (
                <>
                  <span onDoubleClick={(e) => startEditingTab(tab.id, e)}>{tab.name}</span>
                  <button
                    onClick={(e) => removeTab(tab.id, e)}
                    className="hover:bg-[#3d3d3d] rounded-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          ))}
          <button
            onClick={addTab}
            className="px-3 py-2 hover:bg-[#2d2d2d] text-gray-400 hover:text-gray-300"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="lua"
            theme="vs-dark"
            value={activeTab?.content}
            onChange={updateTabContent}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              lineNumbers: 'on',
              glyphMargin: true,
              folding: true,
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-[#252526] border-l border-[#3d3d3d] p-4">
          <h2 className="text-sm font-semibold mb-4">Workspace</h2>
          <div className="text-sm text-gray-400">No files open</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#2d2d2d] border-t border-[#3d3d3d] p-2">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1 hover:bg-[#3d3d3d] rounded">
            <Play className="w-4 h-4" />
            <span className="text-sm">Execute</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1 hover:bg-[#3d3d3d] rounded">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Clear</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1 hover:bg-[#3d3d3d] rounded">
            <FolderOpen className="w-4 h-4" />
            <span className="text-sm">Open</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1 hover:bg-[#3d3d3d] rounded">
            <Terminal className="w-4 h-4" />
            <span className="text-sm">Execute</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1 hover:bg-[#3d3d3d] rounded">
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {!isAttached && (
              <span className="text-sm text-yellow-500">Outlet Unattached</span>
            )}
            <button 
              className={`p-1 hover:bg-[#3d3d3d] rounded transition-colors ${isAttached ? 'text-green-500' : 'text-yellow-500'}`}
              onClick={handleLaunch}
            >
              <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Launch Message */}
      {showLaunchMessage && (
        <div className="fixed bottom-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500">
          AWP fully launched
        </div>
      )}
    </div>
  );
}

export default App;