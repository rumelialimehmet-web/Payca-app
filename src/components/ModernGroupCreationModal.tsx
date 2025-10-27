import React, { useState } from 'react';

export interface ModernGroupCreationModalProps {
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  onCreateGroup: (groupData: GroupCreationData) => void;
  onClose: () => void;
}

export interface GroupCreationData {
  name: string;
  icon: string;
  currency: string;
  description?: string;
  members: Array<{ id: string; name: string; avatar?: string }>;
}

const GROUP_ICONS = ['🏖️', '🏠', '✈️', '🍔', '⚽️', '🎉', '💼', '🎓', '🎮', '🎵', '🎬', '📚'];

const CURRENCIES = [
  { value: 'TRY', label: '₺ Türk Lirası', symbol: '₺' },
  { value: 'USD', label: '$ US Dollar', symbol: '$' },
  { value: 'EUR', label: '€ Euro', symbol: '€' }
];

export function ModernGroupCreationModal({
  currentUser,
  onCreateGroup,
  onClose
}: ModernGroupCreationModalProps) {
  const [selectedIcon, setSelectedIcon] = useState('🏖️');
  const [groupName, setGroupName] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [description, setDescription] = useState('');
  const [additionalMembers, setAdditionalMembers] = useState<Array<{ id: string; name: string; avatar?: string }>>([]);
  const [showAddMemberInput, setShowAddMemberInput] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember = {
        id: `temp-${Date.now()}`,
        name: newMemberName.trim(),
        avatar: undefined
      };
      setAdditionalMembers([...additionalMembers, newMember]);
      setNewMemberName('');
      setShowAddMemberInput(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setAdditionalMembers(additionalMembers.filter(m => m.id !== memberId));
  };

  const handleSubmit = () => {
    if (!groupName.trim()) {
      alert('Lütfen grup adını girin');
      return;
    }

    const groupData: GroupCreationData = {
      name: groupName.trim(),
      icon: selectedIcon,
      currency,
      description: description.trim() || undefined,
      members: [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
        ...additionalMembers
      ]
    };

    onCreateGroup(groupData);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-200">
      <div
        className="relative flex w-full max-w-lg flex-col bg-background-light dark:bg-background-dark shadow-2xl animate-in slide-in-from-bottom duration-300"
        style={{ height: '600px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}
      >
        {/* Header with Drag Handle, Title and Close Button */}
        <div className="flex-shrink-0 px-6 pt-4 pb-2">
          <div className="flex h-5 w-full items-center justify-center pb-3">
            <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold leading-tight text-gray-900 dark:text-white">
              Yeni Grup Oluştur
            </h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-grow overflow-y-auto px-6">
          {/* Group Icon Selector */}
          <div className="py-3">
            <p className="pb-3 text-base font-medium text-gray-800 dark:text-gray-200">
              Grup Simgesi
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                    selectedIcon === icon
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <p className="text-2xl">{icon}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Group Name & Currency */}
          <div className="flex flex-col gap-5 pt-3">
            <label className="flex flex-col w-full">
              <p className="pb-2 text-base font-medium text-gray-800 dark:text-gray-200">
                Grup Adı
              </p>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="form-input flex h-[52px] w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-gray-50 dark:bg-gray-800 p-4 text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-0 focus:ring-2 focus:ring-primary/50"
                placeholder="örn: Bodrum Tatili 2024"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col w-full col-span-2">
                <p className="pb-2 text-base font-medium text-gray-800 dark:text-gray-200">
                  Para Birimi
                </p>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-select h-[52px] w-full appearance-none rounded-lg border-none bg-gray-50 dark:bg-gray-800 p-3.5 pr-10 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col w-full">
              <p className="pb-2 text-base font-medium text-gray-800 dark:text-gray-200">
                Açıklama (İsteğe bağlı)
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea w-full resize-none rounded-lg border-none bg-gray-50 dark:bg-gray-800 p-4 text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-0 focus:ring-2 focus:ring-primary/50"
                placeholder="Grup hakkında kısa bir açıklama..."
                rows={3}
                style={{ height: '96px' }}
              />
            </label>
          </div>

          {/* Participants Section */}
          <div className="py-5">
            <p className="pb-3 text-base font-medium text-gray-800 dark:text-gray-200">
              Katılımcılar
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Current User */}
              <div className="flex flex-col items-center gap-1">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="You"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(currentUser.name)}
                  </div>
                )}
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Sen</p>
              </div>

              {/* Additional Members */}
              {additionalMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center gap-1 relative group">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(member.name)}
                    </div>
                  )}
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-[60px]">
                    {member.name.split(' ')[0]}
                  </p>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
              ))}

              {/* Add Member Button */}
              {!showAddMemberInput ? (
                <button
                  onClick={() => setShowAddMemberInput(true)}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl text-primary">add</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                    placeholder="İsim girin"
                    autoFocus
                    className="w-32 h-10 px-3 text-sm rounded-lg border-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-0 focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={handleAddMember}
                    className="h-10 px-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Ekle
                  </button>
                  <button
                    onClick={() => {
                      setShowAddMemberInput(false);
                      setNewMemberName('');
                    }}
                    className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-shrink-0 flex-col gap-3 px-6 pt-2 pb-6 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSubmit}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            Grubu Oluştur
          </button>
          <button
            onClick={onClose}
            className="h-10 w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModernGroupCreationModal;
