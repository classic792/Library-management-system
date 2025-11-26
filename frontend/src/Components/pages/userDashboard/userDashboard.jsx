import "./userDashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="stats">
        <div className="card">Total Books: 120</div>
        <div className="card">Borrowed Books: 35</div>
        <div className="card">Users: 85</div>
        <div className="card">Total Borrowed Books: 12</div>
      </div>
    </div>
  );
};

export default Dashboard;
