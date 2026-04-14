import React, { useState } from 'react';
import { 
  Search, Plus, Users as UsersIcon, GraduationCap, 
  Edit, Trash2, X, User, Mail, Phone, MapPin, Bus
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import '../styles/Users.css';

const initialUsers = [
  { id: 'U001', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', role: 'student', route: 'R-101', status: 'active' },
  { id: 'U002', name: 'Priya Patil', email: 'priya@example.com', phone: '+91 87654 32109', role: 'student', route: 'R-105', status: 'active' },
  { id: 'U003', name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 76543 21098', role: 'parent', route: 'R-101', status: 'active' },
  { id: 'U004', name: 'Amit Deshmukh', email: 'amit@example.com', phone: '+91 65432 10987', role: 'student', route: 'R-112', status: 'inactive' },
  { id: 'U005', name: 'Kavita Joshi', email: 'kavita@example.com', phone: '+91 54321 09876', role: 'parent', route: 'R-105', status: 'active' },
  { id: 'U006', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 43210 98765', role: 'driver', route: 'R-101', status: 'active' },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '', email: '', phone: '', role: 'student', route: ''
  });

  const tabs = [
    { key: 'all', label: 'All Users', icon: UsersIcon },
    { key: 'student', label: 'Students', icon: GraduationCap },
    { key: 'parent', label: 'Parents', icon: User },
    { key: 'driver', label: 'Drivers', icon: Bus },
  ];

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === 'all' || u.role === activeTab;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const id = `U${String(users.length + 1).padStart(3, '0')}`;
    setUsers([...users, { ...newUser, id, status: 'active' }]);
    setNewUser({ name: '', email: '', phone: '', role: 'student', route: '' });
    setShowModal(false);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const avatarColors = ['', 'green', 'orange', 'blue'];

  return (
    <div className="users-page">
      <header className="page-header">
        <h1>Users & Students</h1>
        <p>Manage students, parents, and drivers across your transportation network.</p>
      </header>

      {/* Tab Bar */}
      <div className="users-tab-bar" id="users-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            id={`tab-${tab.key}`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Bar */}
      <div className="users-top-bar">
        <div className="users-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="users-search-input"
          />
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} id="btn-add-user">
          <Plus size={16} /> Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-card users-table-card">
        <div className="table-container">
          <table id="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Route</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-row-info">
                      <div className={`user-avatar ${avatarColors[i % 4]}`}>
                        {getInitials(user.name)}
                      </div>
                      <div className="user-name-col">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{user.phone}</td>
                  <td>
                    <span className="route-badge" style={{ fontSize: '0.75rem' }}>{user.route}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${user.status === 'active' ? 'online' : 'offline'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn-sm" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button 
                        className="action-btn-sm danger" 
                        title="Delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span className="pagination-info">
            Showing {filteredUsers.length} of {users.length} users
          </span>
          <div className="pagination-btns">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} id="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleAddUser}>
              <div className="form-group">
                <label><User size={14} /> Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Mail size={14} /> Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><Phone size={14} /> Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><MapPin size={14} /> Assigned Route</label>
                  <input
                    type="text"
                    placeholder="e.g. R-101"
                    value={newUser.route}
                    onChange={(e) => setNewUser({ ...newUser, route: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" id="btn-submit-user">
                  <Plus size={16} /> Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
